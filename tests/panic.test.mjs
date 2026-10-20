import test from "node:test";
import assert from "node:assert/strict";
import { createPanicHandlers, PANIC_TARGETS } from "../supabase/functions/dynamic-function/panic.mjs";

const response = (value, status = 200) => new Response(status === 204 ? null : JSON.stringify(value), { status });

function fixture(options = {}) {
  let time = 1_800_000_000_000;
  const values = {
    SUPABASE_URL: `https://${PANIC_TARGETS.projectRef}.supabase.co`,
    PANIC_DELETION_ENABLED: "true", PANIC_GITHUB_TOKEN: "test-github-token",
    PANIC_SUPABASE_MANAGEMENT_TOKEN: "test-management-token",
    DISCORD_APPLICATION_ID: "100", DISCORD_REVIEW_CHANNEL_ID: "200", DISCORD_PHOTO_ARCHIVE_CHANNEL_ID: "201",
    ...options.env,
  };
  const calls = [];
  const reports = [];
  const tasks = [];
  const state = { id: true, status: "running", steps: { ...options.steps } };
  const objectPages = options.objectPages ? structuredClone(options.objectPages) : [];
  const handlers = createPanicHandlers({
    env: (name) => values[name], serviceKey: () => "test-only-service-key",
    json: (body) => response(body), now: () => time,
    ownerId: async () => options.owner || "400",
    setSiteLive: async (isLive) => { calls.push({ action: "pause", isLive }); return options.pauseSucceeds !== false; },
    clearDiscordPosts: async (channel) => {
      calls.push({ action: "clear-discord", channel });
      if (options.discordFailure === channel) throw new Error("Discord cleanup failed.");
    },
    discordApi: async (url, init) => { reports.push(JSON.parse(init.body).content); return response({}); },
    waitUntil: (task) => tasks.push(task),
    fetch: async (url, init = {}) => {
      const method = init.method || "GET";
      calls.push({ action: "fetch", url: String(url), method });
      if (url.includes("/rpc/claim_site_panic")) {
        if (options.missingSql) return response({}, 404);
        if (options.locked) return response([]);
        state.job_id = JSON.parse(init.body).p_job_id;
        return response([state]);
      }
      if (url.includes("/rest/v1/site_panic_state")) {
        Object.assign(state, JSON.parse(init.body));
        return response([state]);
      }
      if (url.startsWith("https://api.github.com/")) {
        if (method === "GET") return response({ full_name: options.repository || PANIC_TARGETS.repository, permissions: { admin: true } }, options.githubReadStatus || 200);
        return response({}, options.githubDeleteStatus || 204);
      }
      if (url.startsWith("https://api.supabase.com/")) {
        return response({ ref: PANIC_TARGETS.projectRef }, method === "GET" ? (options.projectReadStatus || 200) : (options.projectDeleteStatus || 200));
      }
      if (url.startsWith("https://api.cloudflare.com/")) {
        if (method === "GET" && url.includes("/objects?")) return response({ success: true, result: objectPages.shift() || [] });
        if (method === "GET") return response({ success: true, result: { name: "ensmbz-media" } });
        return response({ success: true }, options.r2DeleteStatus || 200);
      }
      throw new Error(`Unexpected mock request ${method} ${url}`);
    },
  });
  const interaction = {
    id: "900000000000000000", type: 3, application_id: "100", channel_id: "200", guild_id: "300", token: "test-interaction-token",
    member: { user: { id: "400" }, roles: ["1561871834545266798"] },
    data: { custom_id: "ensmbz:panic:300:400" },
  };
  async function confirmation(overrides = {}) {
    const shown = await (await handlers.button(interaction)).json();
    assert.equal(shown.type, 9);
    return {
      ...structuredClone(interaction), type: 5,
      data: { custom_id: shown.data.custom_id, components: [{ type: 1, components: [{ type: 4, custom_id: "delete_confirmation", value: PANIC_TARGETS.confirmation }] }] },
      ...overrides,
    };
  }
  return { handlers, interaction, confirmation, calls, reports, state, values, advance: (ms) => { time += ms; }, flush: () => Promise.all(tasks) };
}

const deletes = (f) => f.calls.filter((call) => call.method === "DELETE");

test("button opens a typed confirmation without deleting anything", async () => {
  const f = fixture();
  const shown = await (await f.handlers.button(f.interaction)).json();
  assert.equal(shown.type, 9);
  assert.ok(shown.data.custom_id.length <= 100);
  assert.equal(f.calls.length, 0);
});

test("the King role does not grant access to full deletion", async () => {
  const f = fixture();
  const intruder = structuredClone(f.interaction);
  intruder.member.user.id = "401";
  intruder.data.custom_id = "ensmbz:panic:300:401";
  assert.equal((await (await f.handlers.button(intruder)).json()).type, 4);
  assert.equal(f.calls.length, 0);
});

test("the owner is checked again when the confirmation is submitted", async () => {
  const f = fixture();
  const modal = await f.confirmation();
  modal.member.user.id = "401";
  assert.equal((await (await f.handlers.modal(modal)).json()).type, 4);
  assert.equal(deletes(f).length, 0);
});

test("expired, forged and incorrect text confirmations never delete", async (t) => {
  for (const kind of ["expired", "forged", "wrong text", "wrong channel", "wrong guild"]) {
    await t.test(kind, async () => {
      const f = fixture();
      const modal = await f.confirmation();
      if (kind === "expired") f.advance(301_000);
      if (kind === "forged") modal.data.custom_id = modal.data.custom_id.slice(0, -1) + (modal.data.custom_id.endsWith("a") ? "b" : "a");
      if (kind === "wrong text") modal.data.components[0].components[0].value = "delete ens mbz";
      if (kind === "wrong channel") modal.channel_id = "999";
      if (kind === "wrong guild") modal.guild_id = "999";
      assert.equal((await (await f.handlers.modal(modal)).json()).type, 4);
      assert.equal(f.calls.length, 0);
    });
  }
});

test("missing credentials, disarmed deletion and the wrong project fail closed", async (t) => {
  for (const env of [{ PANIC_GITHUB_TOKEN: "" }, { PANIC_SUPABASE_MANAGEMENT_TOKEN: "" }, { PANIC_DELETION_ENABLED: "false" }, { SUPABASE_URL: "https://another-project.supabase.co" }]) {
    await t.test(JSON.stringify(Object.keys(env)), async () => {
      const f = fixture();
      const modal = await f.confirmation();
      Object.assign(f.values, env);
      assert.equal((await (await f.handlers.modal(modal)).json()).type, 4);
      assert.equal(f.calls.length, 0);
    });
  }
});

test("missing SQL and duplicate/running jobs do not start deletion", async (t) => {
  for (const option of [{ missingSql: true }, { locked: true }]) {
    await t.test(JSON.stringify(option), async () => {
      const f = fixture(option);
      await f.handlers.modal(await f.confirmation());
      await f.flush();
      assert.equal(deletes(f).length, 0);
      assert.equal(f.calls.some((call) => call.action === "pause"), false);
      assert.ok(f.reports.length > 0);
    });
  }
});

test("all provider access checks must pass before any deletion", async (t) => {
  for (const option of [{ projectReadStatus: 403 }, { githubReadStatus: 403 }, { repository: "different-owner/different-site" }]) {
    await t.test(JSON.stringify(option), async () => {
      const f = fixture(option);
      await f.handlers.modal(await f.confirmation());
      await f.flush();
      assert.equal(deletes(f).length, 0);
      assert.equal(f.calls.some((call) => call.action === "pause"), false);
      assert.equal(f.state.status, "failed");
    });
  }
});

test("confirmed owner deletion removes only the fixed repo and deletes Supabase last", async () => {
  const f = fixture();
  assert.equal((await (await f.handlers.modal(await f.confirmation())).json()).type, 5);
  await f.flush();
  assert.deepEqual(deletes(f).map((call) => call.url), [
    `https://api.github.com/repos/${PANIC_TARGETS.repository}`,
    `https://api.supabase.com/v1/projects/${PANIC_TARGETS.projectRef}`,
  ]);
  assert.deepEqual(f.calls.filter((call) => call.action === "clear-discord").map((call) => call.channel), ["200", "201"]);
  assert.equal(f.state.steps.github_deleted, true);
  assert.equal(f.state.steps.project_delete_started, true);
  assert.match(f.reports.at(-1), /Supabase accepted deletion/);
});

test("a failed Discord cleanup leaves GitHub and the backend available to retry", async () => {
  const f = fixture({ discordFailure: "201" });
  await f.handlers.modal(await f.confirmation());
  await f.flush();
  assert.equal(deletes(f).length, 0);
  assert.equal(f.state.status, "failed");
});

test("GitHub delete permission failures including 404 do not delete the backend", async (t) => {
  for (const status of [403, 404]) {
    await t.test(String(status), async () => {
      const f = fixture({ githubDeleteStatus: status });
      await f.handlers.modal(await f.confirmation());
      await f.flush();
      assert.equal(deletes(f).length, 1);
      assert.equal(f.state.status, "failed");
      assert.match(f.reports.at(-1), /GitHub repository deletion failed/);
    });
  }
});

test("a retry resumes after a previously started repository deletion", async () => {
  const f = fixture({ githubReadStatus: 404, steps: { discord_deleted: true, github_delete_started: true } });
  await f.handlers.modal(await f.confirmation());
  await f.flush();
  assert.equal(f.calls.some((call) => call.action === "clear-discord"), false);
  assert.deepEqual(deletes(f).map((call) => call.url), [`https://api.supabase.com/v1/projects/${PANIC_TARGETS.projectRef}`]);
});

test("a configured R2 bucket is fully emptied before deletion of the repository or backend", async () => {
  const f = fixture({ env: { R2_ACCOUNT_ID: "test-account", R2_BUCKET_NAME: "ensmbz-media", PANIC_CLOUDFLARE_API_TOKEN: "test-cloudflare-token" }, objectPages: [[{ key: "photos/a&b.jpg" }], [{ key: "videos/second.mp4" }], []] });
  await f.handlers.modal(await f.confirmation());
  await f.flush();
  const paths = deletes(f).map((call) => call.url);
  assert.equal(paths.length, 5);
  assert.ok(paths[0].endsWith("/objects/photos%2Fa%26b.jpg"));
  assert.ok(paths[1].endsWith("/objects/videos%2Fsecond.mp4"));
  assert.ok(paths[2].endsWith("/buckets/ensmbz-media"));
  assert.ok(paths[4].startsWith("https://api.supabase.com/"));
  assert.equal(f.state.steps.r2_deleted, true);
});

test("R2 deletion failures stop before losing the backend needed to resume", async () => {
  const f = fixture({ env: { R2_ACCOUNT_ID: "test-account", R2_BUCKET_NAME: "ensmbz-media", PANIC_CLOUDFLARE_API_TOKEN: "test-cloudflare-token" }, objectPages: [[{ key: "photo.jpg" }]], r2DeleteStatus: 403 });
  await f.handlers.modal(await f.confirmation());
  await f.flush();
  assert.equal(deletes(f).length, 1);
  assert.equal(f.state.status, "failed");
  assert.equal(deletes(f).some((call) => call.url.startsWith("https://api.supabase.com/")), false);
});

test("a failed final project deletion reports the irreversible completed steps", async () => {
  const f = fixture({ projectDeleteStatus: 403 });
  await f.handlers.modal(await f.confirmation());
  await f.flush();
  assert.match(f.reports.at(-1), /Supabase project deletion failed/);
  assert.match(f.reports.at(-1), /github_deleted/);
  assert.equal(f.state.status, "failed");
});
