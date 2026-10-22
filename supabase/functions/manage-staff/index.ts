const cors = {
  "access-control-allow-origin": "https://ensmbz.github.io",
  "access-control-allow-headers": "authorization, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};
const permissionNames = ["review_photos", "manage_comments", "manage_reports", "manage_takedowns", "manage_chat", "manage_site"];
const staffLoginDomain = "staff.ensmbz.local";

function reply(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return reply({ error: "POST required" }, 405);
  try {
    const baseUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/$/, "") || "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const authorization = request.headers.get("authorization") || "";
    const userResponse = await fetch(`${baseUrl}/auth/v1/user`, { headers: { apikey: anonKey, authorization } });
    const user = await userResponse.json().catch(() => ({}));
    const ownerEmail = String(user.email || "").toLowerCase();
    if (!userResponse.ok || !ownerEmail) return reply({ error: "Owner sign-in required." }, 401);
    const adminHeaders = { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, "content-type": "application/json" };
    const ownerResponse = await fetch(`${baseUrl}/rest/v1/photo_admin_emails?email=eq.${encodeURIComponent(ownerEmail)}&select=email`, { headers: adminHeaders });
    const owners = await ownerResponse.json().catch(() => []);
    if (!ownerResponse.ok || !Array.isArray(owners) || owners.length !== 1) return reply({ error: "Only the owner can manage staff accounts." }, 403);

    const body = await request.json().catch(() => ({}));
    const username = String(body.username || "").trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9_-]{2,31}$/.test(username)) return reply({ error: "Staff usernames need 3-32 letters, numbers, hyphens, or underscores." }, 400);
    const email = `${username}@${staffLoginDomain}`;
    const usersResponse = await fetch(`${baseUrl}/auth/v1/admin/users?per_page=1000`, { headers: adminHeaders });
    const usersPayload = await usersResponse.json().catch(() => ({}));
    const existing = Array.isArray(usersPayload.users) ? usersPayload.users.find((item: Record<string, unknown>) => String(item.email || "").toLowerCase() === email) : null;

    if (body.action === "remove") {
      if (existing?.id) await fetch(`${baseUrl}/auth/v1/admin/users/${existing.id}`, { method: "DELETE", headers: adminHeaders });
      const removed = await fetch(`${baseUrl}/rest/v1/staff_permissions?username=eq.${encodeURIComponent(username)}`, { method: "DELETE", headers: adminHeaders });
      if (!removed.ok) return reply({ error: "Could not remove staff access." }, 502);
      return reply({ ok: true });
    }

    const password = String(body.password || "");
    if (!existing && password.length < 8) return reply({ error: "New staff accounts need a password with at least 8 characters." }, 400);
    if (password && password.length < 8) return reply({ error: "Passwords need at least 8 characters." }, 400);
    if (existing?.id && password) {
      const updated = await fetch(`${baseUrl}/auth/v1/admin/users/${existing.id}`, { method: "PUT", headers: adminHeaders, body: JSON.stringify({ password, email_confirm: true }) });
      if (!updated.ok) return reply({ error: "Could not update the staff password." }, 502);
    } else if (!existing) {
      const created = await fetch(`${baseUrl}/auth/v1/admin/users`, { method: "POST", headers: adminHeaders, body: JSON.stringify({ email, password, email_confirm: true }) });
      if (!created.ok) return reply({ error: "Could not create the staff login." }, 502);
    }

    const permissions: Record<string, boolean | string> = { email, username, updated_at: new Date().toISOString() };
    permissionNames.forEach((name) => { permissions[name] = body.permissions?.[name] === true; });
    const saved = await fetch(`${baseUrl}/rest/v1/staff_permissions?on_conflict=email`, {
      method: "POST", headers: { ...adminHeaders, prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(permissions),
    });
    if (!saved.ok) return reply({ error: "The login exists, but its permissions could not be saved." }, 502);
    return reply({ ok: true });
  } catch {
    return reply({ error: "Staff account management failed." }, 500);
  }
});
