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

type PhotoRecord = {
  id: number | string;
  name: string;
  image_url: string;
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

function buttonComponents(id: string, state: "pending" | "reviewed" | "deleted" = "pending") {
  const isDeleted = state === "deleted";
  return [{
    type: 1,
    components: [
      { type: 2, style: 3, label: "Approve", custom_id: `ensmbz:approve:${id}`, disabled: state !== "pending" },
      { type: 2, style: 4, label: "Decline", custom_id: `ensmbz:decline:${id}`, disabled: state !== "pending" },
      { type: 2, style: 4, label: "Delete photo", custom_id: `ensmbz:delete:${id}`, disabled: isDeleted },
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
  const existing = Array.isArray(commands) ? commands.find((item: any) => item.name === "site") : null;
  const response = await fetch(existing ? `${endpoint}/${existing.id}` : endpoint, {
    method: existing ? "PATCH" : "POST",
    headers: { authorization: `Bot ${token}`, "content-type": "application/json" },
    body: JSON.stringify(SITE_COMMAND),
  });
  if (!response.ok) {
    console.error("Could not register Discord /site command", response.status, await response.text());
    return json({ error: "Discord could not register /site. Check that the bot has applications.commands permission." }, 502);
  }
  return json({ ok: true, command: "/site", guild_id: channel.guild_id });
}

async function postPendingPhoto(record: PhotoRecord): Promise<Response> {
  if (!record.id || !record.name || !record.image_url || record.approved !== false) {
    return json({ ok: true, ignored: true });
  }
  const channelId = requiredEnv("DISCORD_REVIEW_CHANNEL_ID");
  const token = requiredEnv("DISCORD_BOT_TOKEN");
  const safeName = record.name.replace(/[\r\n<>]/g, " ").slice(0, 60);
  const posted = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: { authorization: `Bot ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      content: `📷 **New photo for review** · Submission #${record.id} · Added by ${safeName}`,
      embeds: [{ title: APP_NAME, image: { url: record.image_url }, footer: { text: `Submission #${record.id}` } }],
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
  const posted = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: { authorization: `Bot ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      content: `📷 **Approved photo** · Submission #${record.id} · Added by ${safeName}`,
      embeds: [{ title: APP_NAME, image: { url: record.image_url }, footer: { text: `Submission #${record.id}` } }],
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
  if (inArchive && (action !== "delete" || !hasRole(SITE_CONTROL_ROLE_ID))) {
    return json({ type: 4, data: { content: "You need the King role to delete archived photos.", flags: 64 } });
  }
  if (inReview && action === "delete" && !hasRole(APPROVER_ROLE_ID) && !hasRole(SITE_CONTROL_ROLE_ID)) {
    return json({ type: 4, data: { content: "You need the King or Photo Approver role to delete photos.", flags: 64 } });
  }
  if (inReview && action !== "delete" && !hasRole(APPROVER_ROLE_ID)) {
    if (!hasRole(SITE_CONTROL_ROLE_ID)) {
      return json({ type: 4, data: { content: "You need the King or Photo Approver role to review submissions.", flags: 64 } });
    }
  }
  const projectUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const key = supabaseKey();

  if (action === "delete") {
    const rowUrl = `${projectUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(id)}&select=id,name,image_url,discord_archive_message_id`;
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
    try {
      const imageUrl = new URL(String(rows[0].image_url));
      const storageMatch = /^\/storage\/v1\/object\/(?:public|sign)\/zayed-photos\/(.+)$/.exec(imageUrl.pathname);
      if (!storageMatch) throw new Error("Photo is not stored in the zayed-photos bucket");
      objectPath = decodeURIComponent(storageMatch[1]);
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

    const removedFile = await fetch(`${projectUrl}/storage/v1/object/zayed-photos/${objectPath.split("/").map(encodeURIComponent).join("/")}`, {
      method: "DELETE",
      headers: { apikey: key, authorization: `Bearer ${key}` },
    });
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
        content: `🗑️ Photo deleted from the website.${cleanupNote}${archiveCleanupNote}${reviewerId ? ` Deleted by <@${reviewerId}>.` : ""}`,
        embeds: [],
        components: inArchive ? archiveComponents(id, true) : buttonComponents(id, "deleted"),
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
    if (!await verifyDiscordSignature(request, body)) return json({ error: "Invalid Discord signature" }, 401);
    const interaction = JSON.parse(body) as Record<string, any>;
    if (interaction.application_id !== requiredEnv("DISCORD_APPLICATION_ID")) return json({ error: "Wrong application" }, 401);
    if (interaction.type === 1) return json({ type: 1 });
    if (interaction.type === 3) return await handleButton(interaction);
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
