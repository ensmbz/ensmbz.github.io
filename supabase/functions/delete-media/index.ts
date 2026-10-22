const cors = {
  "access-control-allow-origin": "https://ensmbz.github.io",
  "access-control-allow-headers": "authorization, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};

function reply(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return reply({ error: "POST required" }, 405);
  try {
    const baseUrl = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const authorization = request.headers.get("authorization") || "";
    const userResponse = await fetch(`${baseUrl}/auth/v1/user`, { headers: { apikey: anonKey, authorization } });
    const user = await userResponse.json().catch(() => ({}));
    const email = String(user.email || "").toLowerCase();
    if (!userResponse.ok || !email) return reply({ error: "Sign in again before deleting media." }, 401);

    const adminHeaders = { apikey: serviceKey, authorization: `Bearer ${serviceKey}` };
    const [ownerResponse, staffResponse] = await Promise.all([
      fetch(`${baseUrl}/rest/v1/photo_admin_emails?email=eq.${encodeURIComponent(email)}&select=email`, { headers: adminHeaders }),
      fetch(`${baseUrl}/rest/v1/staff_permissions?email=eq.${encodeURIComponent(email)}&manage_takedowns=eq.true&select=email`, { headers: adminHeaders }),
    ]);
    const owners = await ownerResponse.json().catch(() => []);
    const staff = await staffResponse.json().catch(() => []);
    if ((!Array.isArray(owners) || !owners.length) && (!Array.isArray(staff) || !staff.length)) {
      return reply({ error: "You do not have permission to delete gallery media." }, 403);
    }

    const { id } = await request.json().catch(() => ({}));
    if (!Number.isSafeInteger(Number(id))) return reply({ error: "Invalid media id." }, 400);
    const photoResponse = await fetch(`${baseUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(String(id))}&select=id,image_url`, { headers: adminHeaders });
    const photos = await photoResponse.json().catch(() => []);
    if (!photoResponse.ok || !Array.isArray(photos) || !photos.length) return reply({ error: "Media was already removed." }, 404);

    const imageUrl = String(photos[0].image_url || "");
    const storageMarker = "/storage/v1/object/public/zayed-photos/";
    const markerIndex = imageUrl.indexOf(storageMarker);
    if (markerIndex >= 0) {
      const objectPath = imageUrl.slice(markerIndex + storageMarker.length).split("?")[0];
      const storageResponse = await fetch(`${baseUrl}/storage/v1/object/zayed-photos/${objectPath}`, { method: "DELETE", headers: adminHeaders });
      if (!storageResponse.ok && storageResponse.status !== 404) return reply({ error: "The uploaded file could not be deleted." }, 502);
    }

    const rowResponse = await fetch(`${baseUrl}/rest/v1/photo_submissions?id=eq.${encodeURIComponent(String(id))}`, {
      method: "DELETE", headers: { ...adminHeaders, prefer: "return=minimal" },
    });
    if (!rowResponse.ok) return reply({ error: "The gallery entry could not be deleted." }, 502);
    return reply({ ok: true });
  } catch {
    return reply({ error: "Media deletion failed." }, 500);
  }
});
