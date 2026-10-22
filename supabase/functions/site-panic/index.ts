const PROJECT_REF = "jjyscbieizoguapkcfvs";
const REPOSITORY = "ensmbz/ensmbz.github.io";
const CONFIRMATION = "DELETE EVERYTHING";
const cors = {
  "access-control-allow-origin": "https://ensmbz.github.io",
  "access-control-allow-headers": "authorization, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
  "content-type": "application/json",
};

function reply(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

function required(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Panic setup is missing ${name}.`);
  return value;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return reply({ error: "POST required" }, 405);
  try {
    const supabaseUrl = required("SUPABASE_URL").replace(/\/$/, "");
    const anonKey = required("SUPABASE_ANON_KEY");
    const serviceKey = required("SUPABASE_SERVICE_ROLE_KEY");
    const authorization = request.headers.get("authorization") || "";
    if (!authorization.startsWith("Bearer ")) return reply({ error: "Owner sign-in required." }, 401);

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: anonKey, authorization } });
    const user = await userResponse.json().catch(() => ({}));
    const email = String(user.email || "").toLowerCase();
    if (!userResponse.ok || !email) return reply({ error: "Owner session expired. Sign in again." }, 401);

    const serviceHeaders = { apikey: serviceKey, authorization: `Bearer ${serviceKey}` };
    const ownerResponse = await fetch(`${supabaseUrl}/rest/v1/photo_admin_emails?email=eq.${encodeURIComponent(email)}&select=email`, { headers: serviceHeaders });
    const owners = await ownerResponse.json().catch(() => []);
    if (!ownerResponse.ok || !Array.isArray(owners) || owners.length !== 1) return reply({ error: "Only the site owner can delete everything." }, 403);

    const body = await request.json().catch(() => ({}));
    if (body.confirmation !== CONFIRMATION) return reply({ error: `Type exactly ${CONFIRMATION}.` }, 400);

    await fetch(`${supabaseUrl}/rest/v1/site_control?id=eq.true`, {
      method: "PATCH",
      headers: { ...serviceHeaders, "content-type": "application/json" },
      body: JSON.stringify({ is_live: false, panic_mode: true, updated_at: new Date().toISOString() }),
    });

    const githubResponse = await fetch(`https://api.github.com/repos/${REPOSITORY}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${required("PANIC_GITHUB_TOKEN")}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "ENS-MBZ-owner-panic",
      },
    });
    if (!githubResponse.ok && githubResponse.status !== 404) {
      return reply({ error: `The site was hidden, but GitHub deletion stopped with HTTP ${githubResponse.status}. Nothing else was deleted.` }, 502);
    }

    const projectResponse = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${required("PANIC_SUPABASE_MANAGEMENT_TOKEN")}` },
    });
    if (!projectResponse.ok && projectResponse.status !== 404) {
      return reply({ error: `GitHub was deleted, but Supabase deletion stopped with HTTP ${projectResponse.status}. Restore from the PC backup if needed.` }, 502);
    }
    return reply({ ok: true, message: "GitHub and Supabase deletion started. The local PC backup was kept." });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Panic deletion failed." }, 500);
  }
});
