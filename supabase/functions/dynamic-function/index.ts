import { AwsClient } from "npm:aws4fetch@1.0.20";
import { createPanicHandlers } from "./panic.mjs";
const encoder = new TextEncoder();
const APP_NAME = "ENS MBZ Photo Review";
const APPROVER_ROLE_ID = "1561872957670826135";
const SITE_CONTROL_ROLE_ID = "1561871834545266798";
const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};
const SITE_COMMAND = {
  name: "site",
  description: "Turn the ENS MBZ photo site on or off",
  options: [{
    type: 1,
    name: "off",
    description: "Pause the photo website",
  }, {
    type: 1,
    name: "on",
    description: "Turn the photo website back on",
  }],
};
const PANIC_COMMAND = {
  name: "panic",
  description: "Owner only: permanently delete the ENS MBZ site, media and GitHub repository",
};

type PhotoRecord = {
  id: number | string;
  name: string;
  image_url: string;
  media_type?: "image" | "video";
  approved: boolean;
};

type DatabaseWebhook = {
  type?: string;
  schema?: string;
  table?: string;
  record?: PhotoRecord;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" },
  });
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing required function secret: ${name}`);
  return value;
}

function hexToBytes(hex: string, byteLength: number): Uint8Array | null {
  if (!new RegExp(`^[0-9a-f]{${byteLength * 2}}$`, "i").test(hex)) return null;
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

function buttonComponents(id: string, state: "pending" | "reviewed" = "pending") {
  return [{
    type: 1,
    components: [
      { type: 2, style: 3, label: "Approve", custom_id: `ensmbz:approve:${id}`, disabled: state !== "pending" },
      { type: 2, style: 4, label: "Decline", custom_id: `ensmbz:decline:${id}`, disabled: state !== "pending" },
    ],
  }];
}

function archiveComponents(id: string, deleted = false) {
  return [{
    type: 1,
    components: [{ type: 2, style: 4, label: deleted ? "Deleted" : "Delete photo", custom_id: `ensmbz:delete:${id}`, disabled: deleted }],
  }];
}

function siteCommandAction(options: unknown): "on" | "off" | null {
  if (!Array.isArray(options)) return null;
  for (const option of options) {
    if (!option || typeof option !== "object") continue;
    if ((option as Record<string, unknown>).name === "on" || (option as Record<string, unknown>).name === "off") {
      return (option as Record<string, unknown>).name as "on" | "off";
    }
    const nested = siteCommandAction((option as Record<string, unknown>).options);
    if (nested) return nested;
  }
  return null;
}

function supabaseKey(): string {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  const keys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (keys) {
    try {
      const parsed = JSON.parse(keys);
      if (typeof parsed.default === "string") return parsed.default;
      const first = Object.values(parsed).find((value) => typeof value === "string");
      if (typeof first === "string") return first;
    } catch {
      // Fall through to a clear configuration error.
    }
  }
  throw new Error("Supabase did not provide a server-side secret key to this function.");
}

function supabaseHeaders(key: string) {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

function r2Config() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const bucket = requiredEnv("R2_BUCKET_NAME");
  const publicBase = requiredEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");
  const client = new AwsClient({
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    service: "s3",
    region: "auto",
  });
  return { bucket, publicBase, client, endpoint: `https://${accountId}.r2.cloudflarestorage.com` };
}

function encodedObjectPath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function handleMediaUploadUrl(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const allowedOrigin = Deno.env.get("MEDIA_UPLOAD_ORIGIN")?.trim();
  if (allowedOrigin && origin !== allowedOrigin) return json({ error: "Upload origin is not allowed." }, 403);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name : "";
  const contentType = typeof body?.contentType === "string" ? body.contentType.toLowerCase() : "";
  const size = Number(body?.size);
  const isVideo = contentType.startsWith("video/");
  const allowedImage = /^image\/(jpeg|png|webp|gif|avif|bmp|tiff|heic|heif)$/.test(contentType);
  const allowedVideo = /^video\/(mp4|webm|quicktime|ogg|x-m4v)$/.test(contentType);
  if ((!allowedImage && !allowedVideo) || !Number.isFinite(size) || size <= 0 || size > (isVideo ? 50 : 5) * 1024 * 1024) {
    return json({ error: "Choose a supported photo up to 5 MB or video up to 50 MB." }, 400);
  }
  const extension = name.match(/\.[a-zA-Z0-9]{1,10}$/)?.[0]?.toLowerCase() || (isVideo ? ".mp4" : ".jpg");
  const key = `${isVideo ? "videos" : "photos"}/${crypto.randomUUID()}${extension}`;
  const { bucket, publicBase, client, endpoint } = r2Config();
  const objectUrl = `${endpoint}/${encodeURIComponent(bucket)}/${encodedObjectPath(key)}?X-Amz-Expires=900`;
  const signedRequest = await client.sign(objectUrl, {
    method: "PUT",
    headers: { "content-type": contentType },
    aws: { signQuery: true },
  });
  return json({ uploadUrl: signedRequest.url, publicUrl: `${publicBase}/${encodedObjectPath(key)}`, key, mediaType: isVideo ? "video" : "image" });
}

async function discordApi(url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const response = await fetch(url, init);
    if (response.status !== 429) return response;
    const retryAfter = Number(response.headers.get("retry-after")) || 1;
    await new Promise((resolve) => setTimeout(resolve, Math.ceil(retryAfter * 1000) + 100));
  }
  throw new Error("Discord rate limited the photo cleanup. Try the panic button again shortly.");
}

async function guildOwnerId(guildId: string): Promise<string | null> {
  const response = await discordApi(`https://discord.com/api/v10/guilds/${encodeURIComponent(guildId)}`, {
    headers: { authorization: `Bot ${requiredEnv("DISCORD_BOT_TOKEN")}` },
  });
  if (!response.ok) {
    console.error("Could not check Discord server owner", response.status, await response.text());
    return null;
  }
  const guild = await response.json().catch(() => ({}));
  return typeof guild.owner_id === "string" ? guild.owner_id : null;
}

async function deleteSitePosts(channelId: string): Promise<number> {
  const token = requiredEnv("DISCORD_BOT_TOKEN");
  const appId = requiredEnv("DISCORD_APPLICATION_ID");
  let before = "";
  let deleted = 0;
  while (true) {
    const beforeQuery = before ? `&before=${encodeURIComponent(before)}` : "";
    const listed = await discordApi(`https://discord.com/api/v10/channels/${encodeURIComponent(channelId)}/messages?limit=100${beforeQuery}`, {
      headers: { authorization: `Bot ${token}` },
    });
    if (!listed.ok) throw new Error(`Discord could not read a photo channel (HTTP ${listed.status}).`);
    const messages = await listed.json().catch(() => []);
    if (!Array.isArray(messages) || messages.length === 0) break;
    before = String(messages[messages.length - 1].id || "");

    for (const message of messages) {
      if (message.author?.id !== appId || !message.id) continue;
      const removed = await discordApi(`https://discord.com/api/v10/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(String(message.id))}`, {
        method: "DELETE",
        headers: { authorization: `Bot ${token}` },
      });
      if (removed.status === 404) continue;
      if (!removed.ok) throw new Error(`Discord could not delete a photo post (HTTP ${removed.status}).`);
      deleted++;
    }

    if (messages.length < 100 || !before) break;
  }
  return deleted;
}

const panicHandlers = createPanicHandlers({
  env: (name: string) => Deno.env.get(name),
  serviceKey: supabaseKey, json, ownerId: guildOwnerId,
  clearDiscordPosts: deleteSitePosts, setSiteLive, discordApi,
  waitUntil: (task: Promise<unknown>) => {
    const runtime = (globalThis as typeof globalThis & { EdgeRuntime?: { waitUntil: (promise: Promise<unknown>) => void } }).EdgeRuntime;
    if (runtime) runtime.waitUntil(task);
    else void task.catch((error) => console.error("Panic background task failed", error));
  },
});

async function setSiteLive(isLive: boolean): Promise<boolean> {
  const projectUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const key = supabaseKey();
  const response = await fetch(`${projectUrl}/rest/v1/site_control?id=eq.true`, {
    method: "PATCH",
    headers: { ...supabaseHeaders(key), prefer: "return=representation" },
    body: JSON.stringify({ is_live: isLive, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) {
    console.error("Could not update site status", response.status, await response.text());
    return false;
  }
  const rows = await response.json().catch(() => []);
  return Array.isArray(rows) && rows.length > 0;
}

async function handleSiteCommand(interaction: Record<string, any>): Promise<Response> {
  const channelId = requiredEnv("DISCORD_REVIEW_CHANNEL_ID");
  if (interaction.channel_id !== channelId || !interaction.guild_id) {
    return json({ type: 4, data: { content: "Use /site in the private photo-review channel.", flags: 64 } });
  }
  const memberRoles: unknown = interaction.member?.roles;
  if (!Array.isArray(memberRoles) || !memberRoles.includes(SITE_CONTROL_ROLE_ID)) {
    return json({ type: 4, data: { content: "You need the King role to control the site.", flags: 64 } });
  }
  const action = siteCommandAction(interaction.data?.options) ??
    (interaction.data?.name === "on" || interaction.data?.name === "off" ? interaction.data.name : null);
  if (action !== "on" && action !== "off") {
    return json({ type: 4, data: { content: "Choose /site on or /site off.", flags: 64 } });
  }
  const isLive = action === "on";
  const applicationId = String(interaction.application_id || "");
  const token = String(interaction.token || "");
  if (!applicationId || !token) {
    return json({ type: 4, data: { content: "Discord did not provide a response token. Try the command again.", flags: 64 } });
  }

  const finishCommand = async () => {
    let content: string;
    try {
      const updated = await setSiteLive(isLive);
      content = updated
        ? (isLive ? "✅ The website is back on." : "⏸️ The website is paused.")
        : "I couldn't update the site. Check that the site_control SQL setup was applied.";
    } catch (error) {
      console.error("Could not update site status", error);
      content = "I couldn't update the site. Check the Supabase function secrets and site_control setup.";
    }

    const edited = await fetch(`https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!edited.ok) console.error("Could not send the /site result to Discord", edited.status, await edited.text());
  };
  const backgroundTask = finishCommand().catch((error) => console.error("Could not finish /site command", error));
  const runtime = (globalThis as typeof globalThis & { EdgeRuntime?: { waitUntil: (promise: Promise<unknown>) => void } }).EdgeRuntime;
  if (runtime) runtime.waitUntil(backgroundTask);
  else await backgroundTask;

  return json({ type: 5, data: { flags: 64 } });
}

async function registerSiteCommand(): Promise<Response> {
  const token = requiredEnv("DISCORD_BOT_TOKEN");
  const appId = requiredEnv("DISCORD_APPLICATION_ID");
  const channelId = requiredEnv("DISCORD_REVIEW_CHANNEL_ID");
  const channelResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
    headers: { authorization: `Bot ${token}` },
  });
  const channel = await channelResponse.json().catch(() => ({}));
  if (!channelResponse.ok || !channel.guild_id) {
    console.error("Could not find review channel to register /site", channelResponse.status);
    return json({ error: "Could not find the Discord photo-review channel." }, 502);
  }
  const endpoint = `https://discord.com/api/v10/applications/${appId}/guilds/${channel.guild_id}/commands`;
  const listed = await fetch(endpoint, { headers: { authorization: `Bot ${token}` } });
  if (!listed.ok) {
    console.error("Could not list Discord commands", listed.status, await listed.text());
    return json({ error: "Discord would not list the bot's server commands." }, 502);
  }
  const commands = await listed.json().catch(() => []);
  for (const command of [SITE_COMMAND, PANIC_COMMAND]) {
    const existing = Array.isArray(commands) ? commands.find((item: any) => item.name === command.name) : null;
    const response = await discordApi(existing ? `${endpoint}/${existing.id}` : endpoint, {
      method: existing ? "PATCH" : "POST",
      headers: { authorization: `Bot ${token}`, "content-type": "application/json" },
      body: JSON.stringify(command),
    });
    if (!response.ok) {
      console.error(`Could not register Discord /${command.name} command`, response.status, await response.text());
      return json({ error: `Discord could not register /${command.name}. Check that the bot has applications.commands permission.` }, 502);
    }
  }
  return json({ ok: true, commands: ["/site", "/panic"], guild_id: channel.guild_id });
}

async function postPendingPhoto(record: PhotoRecord): Promise<Response> {
  if (!record.id || !record.name || !record.image_url || record.approved !== false) {
    return json({ ok: true, ignored: true });
  }
  const channelId = requiredEnv("DISCORD_REVIEW_CHANNEL_ID");
  const token = requiredEnv("DISCORD_BOT_TOKEN");
  const safeName = record.name.replace(/[\r\n<>]/g, " ").slice(0, 60);
  const isVideo = record.media_type === "video";
  const submissionEmbed = isVideo
    ? { title: APP_NAME, description: "Video submission — open the link in the message to play it with audio.", footer: { text: `Submission #${record.id}` } }
    : { title: APP_NAME, image: { url: record.image_url }, footer: { text: `Submission #${record.id}` } };
  const posted = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: { authorization: `Bot ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      content: isVideo
        ? `🎞️ **New video for review** · Submission #${record.id} · Added by ${safeName}\n${record.image_url}`
        : `📷 **New photo for review** · Submission #${record.id} · Added by ${safeName}`,
      embeds: [submissionEmbed],
      components: buttonComponents(String(record.id)),
      allowed_mentions: { parse: [] },
    }),
  });
  const postedMessage = await posted.json().catch(() => ({}));
  if (!posted.ok || !postedMessage.id) {
    console.error("Discord message send failed", posted.status);
    return json({ error: "Discord could not post the review message." }, 502);
  }

  const projectUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const key = supabaseKey();
  const saved = await fetch(`${projectUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(String(record.id))}`, {
    method: "PATCH",
    headers: { ...supabaseHeaders(key), prefer: "return=minimal" },
    body: JSON.stringify({ discord_message_id: String(postedMessage.id) }),
  });
  if (!saved.ok) console.error("Could not save Discord message ID", saved.status);
  return json({ ok: true });
}

async function postApprovedPhoto(record: PhotoRecord): Promise<boolean> {
  const channelId = requiredEnv("DISCORD_PHOTO_ARCHIVE_CHANNEL_ID");
  const token = requiredEnv("DISCORD_BOT_TOKEN");
  const safeName = record.name.replace(/[\r\n<>]/g, " ").slice(0, 60);
  const isVideo = record.media_type === "video";
  const approvedEmbed = isVideo
    ? { title: APP_NAME, description: "Approved video — open the link in the message to play it with audio.", footer: { text: `Submission #${record.id}` } }
    : { title: APP_NAME, image: { url: record.image_url }, footer: { text: `Submission #${record.id}` } };
  const posted = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: { authorization: `Bot ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      content: isVideo
        ? `🎞️ **Approved video** · Submission #${record.id} · Added by ${safeName}\n${record.image_url}`
        : `📷 **Approved photo** · Submission #${record.id} · Added by ${safeName}`,
      embeds: [approvedEmbed],
      components: archiveComponents(String(record.id)),
      allowed_mentions: { parse: [] },
    }),
  });
  const message = await posted.json().catch(() => ({}));
  if (!posted.ok || !message.id) {
    console.error("Could not post approved photo to archive", posted.status);
    return false;
  }
  const projectUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const key = supabaseKey();
  const saved = await fetch(`${projectUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(String(record.id))}`, {
    method: "PATCH",
    headers: { ...supabaseHeaders(key), prefer: "return=minimal" },
    body: JSON.stringify({ discord_archive_message_id: String(message.id) }),
  });
  if (!saved.ok) console.error("Could not save archive message ID", saved.status);
  return true;
}

async function handleDatabaseWebhook(request: Request, body: string): Promise<Response> {
  const secret = Deno.env.get("DB_WEBHOOK_SECRET");
  if (!secret || request.headers.get("x-review-hook") !== secret) {
    return json({ error: "Unauthorized webhook" }, 401);
  }
  const payload = JSON.parse(body) as DatabaseWebhook;
  if (payload.type !== "INSERT" || payload.schema !== "public" || payload.table !== "photo_submissions") {
    return json({ ok: true, ignored: true });
  }
  if (!payload.record) return json({ error: "Missing inserted row" }, 400);
  return await postPendingPhoto(payload.record);
}

async function verifyDiscordSignature(request: Request, body: string): Promise<boolean> {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const publicKey = hexToBytes(Deno.env.get("DISCORD_PUBLIC_KEY") || "", 32);
  const signatureBytes = hexToBytes(signature || "", 64);
  if (!timestamp || !/^\d{1,20}$/.test(timestamp) || !publicKey || !signatureBytes) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  try {
    const key = await crypto.subtle.importKey("raw", publicKey, { name: "Ed25519" }, false, ["verify"]);
    return await crypto.subtle.verify("Ed25519", key, signatureBytes, encoder.encode(timestamp + body));
  } catch (error) {
    console.error("Discord signature verification failed", error);
    return false;
  }
}

async function handleButton(interaction: Record<string, any>): Promise<Response> {
  const appId = requiredEnv("DISCORD_APPLICATION_ID");
  const reviewChannelId = requiredEnv("DISCORD_REVIEW_CHANNEL_ID");
  const archiveChannelId = Deno.env.get("DISCORD_PHOTO_ARCHIVE_CHANNEL_ID")?.trim();
  const inArchive = Boolean(archiveChannelId && interaction.channel_id === archiveChannelId);
  const inReview = interaction.channel_id === reviewChannelId;
  if (interaction.application_id !== appId || (!inReview && !inArchive) || !interaction.guild_id) {
    return json({ type: 4, data: { content: "Use the buttons in the private photo-review or photo-archive channel.", flags: 64 } });
  }

  const match = /^ensmbz:(approve|decline|delete):(\d{1,19})$/.exec(String(interaction.data?.custom_id || ""));
  if (!match) return json({ type: 4, data: { content: "That photo action is not valid.", flags: 64 } });
  const [, action, id] = match;
  const memberRoles: unknown = interaction.member?.roles;
  const hasRole = (roleId: string) => Array.isArray(memberRoles) && memberRoles.includes(roleId);
  if (inReview && action === "delete") {
    const components = Array.isArray(interaction.message?.components)
      ? interaction.message.components.map((row: Record<string, any>) => ({
        ...row,
        components: (Array.isArray(row.components) ? row.components : []).filter(
          (component: Record<string, any>) => !String(component.custom_id || "").startsWith("ensmbz:delete:"),
        ),
      }))
      : [];
    return json({
      type: 7,
      data: {
        content: "Photo deletion is only available in #photo-archive.",
        embeds: Array.isArray(interaction.message?.embeds) ? interaction.message.embeds : [],
        components,
        allowed_mentions: { parse: [] },
      },
    });
  }
  if (inArchive && (action !== "delete" || !hasRole(SITE_CONTROL_ROLE_ID))) {
    return json({ type: 4, data: { content: "You need the King role to delete archived photos.", flags: 64 } });
  }
  if (inReview && action !== "delete" && !hasRole(APPROVER_ROLE_ID)) {
    if (!hasRole(SITE_CONTROL_ROLE_ID)) {
      return json({ type: 4, data: { content: "You need the King or Photo Approver role to review submissions.", flags: 64 } });
    }
  }
  const projectUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const key = supabaseKey();

  if (action === "delete") {
    const rowUrl = `${projectUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(id)}&select=id,name,image_url,media_type,discord_archive_message_id`;
    const selected = await fetch(rowUrl, { headers: supabaseHeaders(key) });
    if (!selected.ok) {
      console.error("Could not find photo before deletion", selected.status, await selected.text());
      return json({ type: 4, data: { content: "Could not load this photo for deletion. Try again.", flags: 64 } });
    }
    const rows = await selected.json().catch(() => []);
    if (!Array.isArray(rows) || rows.length === 0) {
      return json({ type: 4, data: { content: "This photo was already deleted or could not be found.", flags: 64 } });
    }
    let objectPath: string;
    let storedInR2 = false;
    try {
      const imageUrl = new URL(String(rows[0].image_url));
      const storageMatch = /^\/storage\/v1\/object\/(?:public|sign)\/zayed-photos\/(.+)$/.exec(imageUrl.pathname);
      if (storageMatch) {
        objectPath = decodeURIComponent(storageMatch[1]);
      } else {
        const publicBase = new URL(requiredEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, ""));
        const prefix = publicBase.pathname.replace(/\/$/, "");
        if (imageUrl.origin !== publicBase.origin || !imageUrl.pathname.startsWith(`${prefix}/`)) throw new Error("Photo URL is not in Supabase Storage or configured R2 public storage");
        objectPath = decodeURIComponent(imageUrl.pathname.slice(prefix.length + 1));
        storedInR2 = true;
      }
    } catch (error) {
      console.error("Could not map photo URL to Storage object", error);
      return json({ type: 4, data: { content: "Could not identify this photo in storage, so nothing was deleted.", flags: 64 } });
    }

    const removedRow = await fetch(`${projectUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { ...supabaseHeaders(key), prefer: "return=representation" },
    });
    if (!removedRow.ok) {
      console.error("Could not remove photo from gallery", removedRow.status, await removedRow.text());
      return json({ type: 4, data: { content: "Could not remove this photo from the gallery. Try again.", flags: 64 } });
    }
    const deletedRows = await removedRow.json().catch(() => []);
    if (!Array.isArray(deletedRows) || deletedRows.length === 0) {
      return json({ type: 4, data: { content: "This photo was already deleted or could not be found.", flags: 64 } });
    }

    let removedFile: Response;
    if (storedInR2) {
      const r2 = r2Config();
      removedFile = await r2.client.fetch(`${r2.endpoint}/${encodeURIComponent(r2.bucket)}/${encodedObjectPath(objectPath)}`, { method: "DELETE" });
    } else {
      removedFile = await fetch(`${projectUrl}/storage/v1/object/zayed-photos/${encodedObjectPath(objectPath)}`, {
        method: "DELETE",
        headers: { apikey: key, authorization: `Bearer ${key}` },
      });
    }
    const reviewerId = interaction.member?.user?.id || interaction.user?.id;
    let archiveCleanupNote = "";
    if (!inArchive && rows[0].discord_archive_message_id && archiveChannelId) {
      const archiveRemoval = await fetch(`https://discord.com/api/v10/channels/${archiveChannelId}/messages/${encodeURIComponent(String(rows[0].discord_archive_message_id))}`, {
        method: "DELETE",
        headers: { authorization: `Bot ${requiredEnv("DISCORD_BOT_TOKEN")}` },
      });
      if (!archiveRemoval.ok && archiveRemoval.status !== 404) {
        archiveCleanupNote = " The archive post could not be removed; delete it manually in #photo-archive.";
        console.error("Could not remove deleted photo from archive", archiveRemoval.status, await archiveRemoval.text());
      }
    }
    const cleanupNote = removedFile.ok ? " The uploaded file was removed too." : " The gallery entry is gone, but storage cleanup failed; check Supabase Storage.";
    if (!removedFile.ok) console.error("Gallery row deleted but Storage cleanup failed", removedFile.status, await removedFile.text());
    return json({
      type: 7,
      data: {
        content: `🗑️ Media deleted from the website.${cleanupNote}${archiveCleanupNote}${reviewerId ? ` Deleted by <@${reviewerId}>.` : ""}`,
        embeds: [],
        components: archiveComponents(id, true),
        allowed_mentions: { parse: [] },
      },
    });
  }

  const approved = action === "approve";
  const update = await fetch(
    `${projectUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(id)}&status=eq.pending`,
    {
      method: "PATCH",
      headers: { ...supabaseHeaders(key), prefer: "return=representation" },
      body: JSON.stringify({ approved, status: approved ? "approved" : "rejected" }),
    },
  );
  if (!update.ok) {
    console.error("Supabase review update failed", update.status, await update.text());
    return json({ type: 4, data: { content: "Could not update the photo. Check the Supabase setup.", flags: 64 } });
  }
  const rows = await update.json().catch(() => []);
  if (!Array.isArray(rows) || rows.length === 0) {
    return json({ type: 4, data: { content: "This photo was already reviewed or could not be found.", flags: 64 } });
  }

  const actionText = approved
    ? "✅ Approved — this photo is now on the website."
    : "🚫 Declined — this photo will not appear on the website.";
  const archived = approved ? await postApprovedPhoto(rows[0] as PhotoRecord).catch((error) => {
    console.error("Approved photo could not be archived", error);
    return false;
  }) : false;
  const reviewerId = interaction.member?.user?.id || interaction.user?.id;
  const archiveNote = approved && !archived ? " ⚠️ It is on the website, but could not be posted to #photo-archive." : "";
  return json({
    type: 7,
    data: {
        content: `${actionText}${archiveNote}${reviewerId ? ` Reviewed by <@${reviewerId}>.` : ""}`,
      embeds: Array.isArray(interaction.message?.embeds) ? interaction.message.embeds : [],
      components: buttonComponents(id, "reviewed"),
      allowed_mentions: { parse: [] },
    },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  const pathname = new URL(request.url).pathname;
  if (pathname.endsWith("/site-control") && request.method === "GET") {
    try {
      const projectUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
      const key = supabaseKey();
      const status = await fetch(`${projectUrl}/rest/v1/site_control?id=eq.true&select=is_live`, {
        headers: supabaseHeaders(key),
      });
      if (!status.ok) return json({ error: "Could not read site status" }, 503);
      const rows = await status.json().catch(() => []);
      if (!Array.isArray(rows) || !rows.length) return json({ error: "Site status is not configured" }, 503);
      return json({ is_live: rows[0].is_live === true }, 200);
    } catch (error) {
      console.error("Could not read site status", error);
      return json({ error: "Could not read site status" }, 503);
    }
  }
  if (pathname.endsWith("/register-site-command") && request.method === "POST") {
    try { return await registerSiteCommand(); }
    catch (error) { console.error("Could not register /site", error); return json({ error: "Could not register /site." }, 500); }
  }
  if (request.method !== "POST") return json({ error: "POST required" }, 405);
  const body = await request.text();
  if (body.length > 1_000_000) return json({ error: "Request too large" }, 413);
  try {
    if (request.headers.has("x-review-hook")) return await handleDatabaseWebhook(request, body);
    if (pathname.endsWith("/media-upload-url")) {
      if (request.method !== "POST") return json({ error: "POST required" }, 405);
      return await handleMediaUploadUrl(new Request(request.url, { method: "POST", headers: request.headers, body }));
    }
    if (!await verifyDiscordSignature(request, body)) return json({ error: "Invalid Discord signature" }, 401);
    const interaction = JSON.parse(body) as Record<string, any>;
    if (interaction.application_id !== requiredEnv("DISCORD_APPLICATION_ID")) return json({ error: "Wrong application" }, 401);
    if (interaction.type === 1) return json({ type: 1 });
    if (interaction.type === 3) {
      if (String(interaction.data?.custom_id || "").startsWith("ensmbz:panic:")) {
        return await panicHandlers.button(interaction);
      }
      return await handleButton(interaction);
    }
    if (interaction.type === 5 && String(interaction.data?.custom_id || "").startsWith("ensmbz:wipe:")) {
      return await panicHandlers.modal(interaction);
    }
    if (interaction.type === 2 && interaction.data?.name === "panic") {
      return await panicHandlers.command(interaction);
    }
    if (interaction.type === 2 && (
      interaction.data?.name === "site" ||
      interaction.data?.name === "on" ||
      interaction.data?.name === "off" ||
      siteCommandAction(interaction.data?.options)
    )) {
      return await handleSiteCommand(interaction);
    }
    return json({ type: 4, data: { content: "This interaction is not supported.", flags: 64 } });
  } catch (error) {
    console.error("Photo review function failed", error);
    return json({ error: "Photo review request failed" }, 500);
  }
});
