const encoder = new TextEncoder();
const APP_NAME = "ENS MBZ Photo Review";
const APPROVER_ROLE_ID = "1561872957670826135";

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
    headers: { "content-type": "application/json; charset=utf-8" },
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
  const channelId = requiredEnv("DISCORD_REVIEW_CHANNEL_ID");
  if (interaction.application_id !== appId || interaction.channel_id !== channelId || !interaction.guild_id) {
    return json({ type: 4, data: { content: "Use the buttons in the private photo-review channel.", flags: 64 } });
  }

  const memberRoles: unknown = interaction.member?.roles;
  if (!Array.isArray(memberRoles) || !memberRoles.includes(APPROVER_ROLE_ID)) {
    return json({ type: 4, data: { content: "You need the Photo Approver role to review submissions.", flags: 64 } });
  }

  const match = /^ensmbz:(approve|decline|delete):(\d{1,19})$/.exec(String(interaction.data?.custom_id || ""));
  if (!match) return json({ type: 4, data: { content: "That review action is not valid.", flags: 64 } });
  const [, action, id] = match;
  const projectUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const key = supabaseKey();

  if (action === "delete") {
    const rowUrl = `${projectUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(id)}&select=id,name,image_url`;
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
    const cleanupNote = removedFile.ok ? " The uploaded file was removed too." : " The gallery entry is gone, but storage cleanup failed; check Supabase Storage.";
    if (!removedFile.ok) console.error("Gallery row deleted but Storage cleanup failed", removedFile.status, await removedFile.text());
    return json({
      type: 7,
      data: {
        content: `🗑️ Photo deleted from the website.${cleanupNote}${reviewerId ? ` Deleted by <@${reviewerId}>.` : ""}`,
        embeds: [],
        components: buttonComponents(id, "deleted"),
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
  const reviewerId = interaction.member?.user?.id || interaction.user?.id;
  return json({
    type: 7,
    data: {
      content: `${actionText}${reviewerId ? ` Reviewed by <@${reviewerId}>.` : ""}`,
      embeds: Array.isArray(interaction.message?.embeds) ? interaction.message.embeds : [],
      components: buttonComponents(id, "reviewed"),
      allowed_mentions: { parse: [] },
    },
  });
}

Deno.serve(async (request: Request) => {
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
    return json({ type: 4, data: { content: "This interaction is not supported.", flags: 64 } });
  } catch (error) {
    console.error("Photo review function failed", error);
    return json({ error: "Photo review request failed" }, 500);
  }
});
