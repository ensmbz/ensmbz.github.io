// These targets are fixed in source. Discord input can never select another site.
export const PANIC_TARGETS = Object.freeze({
  repository: "ensmbz/ensmbz.github.io",
  projectRef: "vuxenevtawplaklregbz",
  confirmation: "DELETE ENS MBZ",
});

export function createPanicHandlers(deps) {
  const { env, serviceKey, json, ownerId, clearDiscordPosts, setSiteLive, discordApi } = deps;
  const request = deps.fetch || globalThis.fetch;
  const now = deps.now || Date.now;
  const need = (name) => {
    const value = env(name)?.trim();
    if (!value) throw new Error(`Missing function secret: ${name}.`);
    return value;
  };
  const reply = (content) => json({ type: 4, data: { content, flags: 64, allowed_mentions: { parse: [] } } });
  const githubUrl = `https://api.github.com/repos/${PANIC_TARGETS.repository}`;
  const projectUrl = `https://api.supabase.com/v1/projects/${PANIC_TARGETS.projectRef}`;

  function config() {
    if (env("PANIC_DELETION_ENABLED") !== "true") throw new Error("Full deletion is not armed. Configure the panic secrets and migration before enabling PANIC_DELETION_ENABLED.");
    const supabaseUrl = need("SUPABASE_URL").replace(/\/$/, "");
    if (supabaseUrl !== `https://${PANIC_TARGETS.projectRef}.supabase.co`) throw new Error("This function is not running in the configured ENS MBZ project.");
    need("DISCORD_PHOTO_ARCHIVE_CHANNEL_ID");
    const githubHeaders = {
      authorization: `Bearer ${need("PANIC_GITHUB_TOKEN")}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "ENS-MBZ-owner-panic",
    };
    const managementHeaders = { authorization: `Bearer ${need("PANIC_SUPABASE_MANAGEMENT_TOKEN")}` };
    const r2Present = ["R2_ACCOUNT_ID", "R2_BUCKET_NAME", "R2_PUBLIC_BASE_URL", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"].some((name) => env(name)?.trim());
    const r2 = r2Present ? {
      name: need("R2_BUCKET_NAME"),
      url: `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(need("R2_ACCOUNT_ID"))}/r2/buckets/${encodeURIComponent(need("R2_BUCKET_NAME"))}`,
      headers: { authorization: `Bearer ${need("PANIC_CLOUDFLARE_API_TOKEN")}` },
    } : null;
    return { supabaseUrl, githubHeaders, managementHeaders, r2 };
  }

  async function checkedFetch(url, init = {}) {
    return request(url, { ...init, signal: AbortSignal.timeout(20_000) });
  }

  async function isOwner(interaction) {
    const guildId = String(interaction.guild_id || "");
    const userId = String(interaction.member?.user?.id || interaction.user?.id || "");
    return Boolean(guildId && userId &&
      interaction.application_id === need("DISCORD_APPLICATION_ID") &&
      interaction.channel_id === need("DISCORD_REVIEW_CHANNEL_ID") &&
      await ownerId(guildId) === userId);
  }

  async function challengeKey() {
    return crypto.subtle.importKey("raw", new TextEncoder().encode(serviceKey()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  }

  function challengeMessage(guildId, userId, timestamp) {
    return new TextEncoder().encode([guildId, userId, timestamp, need("DISCORD_REVIEW_CHANNEL_ID"), PANIC_TARGETS.repository, PANIC_TARGETS.projectRef].join(":"));
  }

  async function challengeId(interaction) {
    const guildId = String(interaction.guild_id);
    const userId = String(interaction.member?.user?.id || interaction.user?.id);
    const timestamp = String(Math.floor(now() / 1000));
    const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await challengeKey(), challengeMessage(guildId, userId, timestamp)));
    const hex = [...signature.slice(0, 12)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `ensmbz:wipe:${guildId}:${userId}:${timestamp}:${hex}`;
  }

  async function validChallenge(interaction) {
    const match = /^ensmbz:wipe:(\d{1,20}):(\d{1,20}):(\d{10}):([a-f0-9]{24})$/.exec(String(interaction.data?.custom_id || ""));
    if (!match) return false;
    const [, guildId, userId, timestamp, signature] = match;
    const age = Math.floor(now() / 1000) - Number(timestamp);
    if (guildId !== String(interaction.guild_id) || userId !== String(interaction.member?.user?.id || interaction.user?.id) || age < 0 || age > 300) return false;
    const expected = new Uint8Array(await crypto.subtle.sign("HMAC", await challengeKey(), challengeMessage(guildId, userId, timestamp)));
    const supplied = signature.match(/../g).map((pair) => Number.parseInt(pair, 16));
    let difference = 0;
    for (let index = 0; index < supplied.length; index++) difference |= supplied[index] ^ expected[index];
    return difference === 0;
  }

  function confirmationValue(components) {
    if (!Array.isArray(components)) return "";
    for (const component of components) {
      if (component?.custom_id === "delete_confirmation" && typeof component.value === "string") return component.value;
      const nested = confirmationValue(component?.components || (component?.component ? [component.component] : []));
      if (nested) return nested;
    }
    return "";
  }

  async function command(interaction) {
    if (!await isOwner(interaction)) return reply("Only the Discord server owner can use /panic in #photo-review.");
    let settings;
    try { settings = config(); }
    catch (error) { return reply(error.message); }
    const targets = [
      `GitHub repository and Pages site: **${PANIC_TARGETS.repository}**`,
      `Entire Supabase project (database, media, functions and keys): **${PANIC_TARGETS.projectRef}**`,
      "This bot’s posts in #photo-review and #photo-archive",
      ...(settings.r2 ? [`R2 bucket and every object: **${settings.r2.name}**`] : []),
    ];
    return json({ type: 4, data: {
      content: `⚠️ **Delete the entire ENS MBZ site permanently**\n${targets.map((target) => `• ${target}`).join("\n")}\n\nThe next step requires typing **${PANIC_TARGETS.confirmation}**.`,
      flags: 64,
      components: [{ type: 1, components: [{ type: 2, style: 4, label: "PANIC — DELETE ENTIRE SITE", custom_id: `ensmbz:panic:${interaction.guild_id}:${interaction.member?.user?.id || interaction.user?.id}` }] }],
      allowed_mentions: { parse: [] },
    } });
  }

  async function button(interaction) {
    const match = /^ensmbz:panic:(\d{1,20}):(\d{1,20})$/.exec(String(interaction.data?.custom_id || ""));
    if (!match || match[1] !== String(interaction.guild_id) || match[2] !== String(interaction.member?.user?.id || interaction.user?.id) || !await isOwner(interaction)) return reply("Only the server owner can use this panic button in #photo-review.");
    try { config(); } catch (error) { return reply(error.message); }
    return json({ type: 9, data: {
      custom_id: await challengeId(interaction),
      title: "Permanently delete ENS MBZ",
      components: [{ type: 1, components: [{ type: 4, custom_id: "delete_confirmation", label: `Type ${PANIC_TARGETS.confirmation}`, style: 1, required: true, min_length: 14, max_length: 14 }] }],
    } });
  }

  async function claim(settings, jobId, interactionId) {
    const response = await checkedFetch(`${settings.supabaseUrl}/rest/v1/rpc/claim_site_panic`, {
      method: "POST", headers: { apikey: serviceKey(), authorization: `Bearer ${serviceKey()}`, "content-type": "application/json" },
      body: JSON.stringify({ p_job_id: jobId, p_interaction_id: interactionId }),
    });
    if (!response.ok) throw new Error("Panic job setup is missing or unavailable. Apply supabase-panic-migration.sql before enabling the button.");
    const rows = await response.json();
    return Array.isArray(rows) ? rows[0] : null;
  }

  async function save(settings, state, changes) {
    const response = await checkedFetch(`${settings.supabaseUrl}/rest/v1/site_panic_state?id=eq.true&job_id=eq.${state.job_id}`, {
      method: "PATCH", headers: { apikey: serviceKey(), authorization: `Bearer ${serviceKey()}`, "content-type": "application/json", prefer: "return=representation" },
      body: JSON.stringify({ ...changes, updated_at: new Date(now()).toISOString() }),
    });
    if (!response.ok) throw new Error("Could not save panic progress; deletion stopped so it can be retried.");
    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length !== 1) throw new Error("The panic job no longer owns the deletion lock.");
    Object.assign(state, rows[0]);
  }

  async function report(interaction, content) {
    const response = await discordApi(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ content, components: [], allowed_mentions: { parse: [] } }),
    });
    if (!response.ok) throw new Error("Discord could not receive the panic progress report.");
  }

  async function preflight(settings, state) {
    const github = await checkedFetch(githubUrl, { headers: settings.githubHeaders });
    if (!(github.status === 404 && state.steps?.github_delete_started)) {
      if (!github.ok) throw new Error(`GitHub access check failed (HTTP ${github.status}); repository deletion has not started.`);
      const repository = await github.json();
      if (repository.full_name?.toLowerCase() !== PANIC_TARGETS.repository || repository.permissions?.admin === false) throw new Error("GitHub token does not administer the configured ENS MBZ repository.");
    }
    settings.githubAlreadyDeleted = github.status === 404;
    const project = await checkedFetch(projectUrl, { headers: settings.managementHeaders });
    if (!project.ok) throw new Error(`Supabase management access check failed (HTTP ${project.status}).`);
    const detail = await project.json();
    if ((detail.ref || detail.id) !== PANIC_TARGETS.projectRef) throw new Error("Supabase returned a different project; deletion stopped.");
    if (settings.r2 && !state.steps?.r2_deleted) {
      const bucket = await checkedFetch(settings.r2.url, { headers: settings.r2.headers });
      if (!(bucket.status === 404 && state.steps?.r2_delete_started)) {
        if (!bucket.ok) throw new Error(`R2 bucket access check failed (HTTP ${bucket.status}).`);
        const detail = await bucket.json();
        if (detail.success !== true || detail.result?.name !== settings.r2.name) throw new Error("Cloudflare returned a different bucket; deletion stopped.");
      }
    }
  }

  async function deleteR2(settings, state) {
    if (!settings.r2 || state.steps?.r2_deleted) return;
    const r2 = settings.r2;
    await save(settings, state, { steps: { ...state.steps, r2_delete_started: true } });
    while (true) {
      const listed = await checkedFetch(`${r2.url}/objects?per_page=100`, { headers: r2.headers });
      if (listed.status === 404) break; // A previous attempt already removed this bucket.
      if (!listed.ok) throw new Error(`R2 could not list remaining media (HTTP ${listed.status}).`);
      const page = await listed.json();
      if (page.success !== true || !Array.isArray(page.result)) throw new Error("R2 returned an invalid object list.");
      if (page.result.length === 0) {
        const removed = await checkedFetch(r2.url, { method: "DELETE", headers: r2.headers });
        if (!removed.ok && removed.status !== 404) throw new Error(`R2 bucket deletion failed (HTTP ${removed.status}).`);
        break;
      }
      // Always start at the first page after deletion: nothing is skipped as keys disappear.
      for (const object of page.result) {
        if (typeof object.key !== "string") throw new Error("R2 returned an object without a key.");
        const removed = await checkedFetch(`${r2.url}/objects/${encodeURIComponent(object.key)}`, { method: "DELETE", headers: r2.headers });
        if (!removed.ok && removed.status !== 404) throw new Error(`R2 media deletion failed (HTTP ${removed.status}).`);
      }
      await save(settings, state, { steps: { ...state.steps } });
    }
    await save(settings, state, { steps: { ...state.steps, r2_deleted: true } });
  }

  async function run(interaction, settings, state) {
    try {
      await preflight(settings, state);
      if (!await setSiteLive(false)) throw new Error("Could not pause the live site; deletion stopped.");
      await report(interaction, "Deletion started. The site is paused. Clearing Discord posts, media storage, the GitHub repository and the backend project.");
      if (!state.steps?.discord_deleted) {
        await clearDiscordPosts(need("DISCORD_REVIEW_CHANNEL_ID"));
        await clearDiscordPosts(need("DISCORD_PHOTO_ARCHIVE_CHANNEL_ID"));
        await save(settings, state, { steps: { ...state.steps, discord_deleted: true } });
      }
      await deleteR2(settings, state);
      if (!state.steps?.github_deleted) {
        if (!settings.githubAlreadyDeleted) {
          await save(settings, state, { steps: { ...state.steps, github_delete_started: true } });
          const removed = await checkedFetch(githubUrl, { method: "DELETE", headers: settings.githubHeaders });
          if (!removed.ok) throw new Error(`GitHub repository deletion failed (HTTP ${removed.status}). Check Administration: write permission.`);
        }
        await save(settings, state, { steps: { ...state.steps, github_deleted: true } });
      }
      // This Edge Function belongs to this project. Delete it last and report before
      // sending the request, because project shutdown can stop the function itself.
      await report(interaction, "The GitHub repository, configured R2 media and Discord site posts have been removed. Sending the final Supabase project deletion request now; this also removes the bot backend. If no completion message arrives, confirm the project is gone in Supabase.");
      await save(settings, state, { steps: { ...state.steps, project_delete_started: true } });
      const removed = await checkedFetch(projectUrl, { method: "DELETE", headers: settings.managementHeaders });
      if (!removed.ok) throw new Error(`Supabase project deletion failed (HTTP ${removed.status}). The other completed deletions cannot be undone.`);
      await report(interaction, "✅ Supabase accepted deletion of the ENS MBZ project. The GitHub repository, website backend, stored media and Discord site posts have been deleted or submitted for provider removal.").catch(() => {});
    } catch (error) {
      await save(settings, state, { status: "failed", last_error: error.message }).catch(() => {});
      await report(interaction, `⚠️ Deletion stopped: ${error.message} Completed steps: ${Object.entries(state.steps || {}).filter(([name, complete]) => complete && !name.endsWith("_started")).map(([name]) => name).join(", ") || "none"}. Fix the reported access/setup issue, then use /panic again to resume.`).catch(() => {});
    }
  }

  async function modal(interaction) {
    if (!await isOwner(interaction) || !await validChallenge(interaction)) return reply("This deletion confirmation is invalid or expired. Only the current server owner can open a new one using /panic.");
    if (confirmationValue(interaction.data?.components) !== PANIC_TARGETS.confirmation) return reply(`Nothing was deleted. Type exactly ${PANIC_TARGETS.confirmation} to confirm.`);
    let settings;
    try { settings = config(); }
    catch (error) { return reply(error.message); }
    // Claim and provider checks run after the immediate Discord acknowledgement.
    const task = (async () => {
      try {
        const state = await claim(settings, crypto.randomUUID(), String(interaction.id));
        if (!state) return await report(interaction, "This confirmation was already used, or a panic deletion is running. Use /panic to create a fresh confirmation; a timed-out worker can be resumed after its 15-minute lock expires.");
        await run(interaction, settings, state);
      } catch (error) { await report(interaction, `Nothing was deleted: ${error.message}`).catch(() => {}); }
    })();
    deps.waitUntil(task);
    return json({ type: 5, data: { flags: 64 } });
  }

  return { command, button, modal };
}
