# ENS MBZ owner-only full-site panic button

`/panic` is restricted to the **current Discord server owner** in the configured private review channel. King and Photo Approver roles cannot authorize full-site deletion. Pressing the button opens a five-minute confirmation dialog; the owner must type `DELETE ENS MBZ` exactly.

The fixed deletion targets are:

- GitHub repository `ensmbz/ensmbz.github.io`, including source/history and its GitHub Pages site.
- Supabase project `vuxenevtawplaklregbz`, including its database, media storage, users, functions, secrets and backend services.
- The site bot's messages in the configured review and archive channels.
- If R2 has been configured: every object and the bucket identified by `R2_ACCOUNT_ID` and `R2_BUCKET_NAME`. Use a bucket dedicated to this site.

The command targets these project resources, not a whole GitHub/Cloudflare account or Discord server. Copies on the owner's PC, other people's devices, forks, screenshots, search indexes and provider-controlled retention/backups are outside the bot's control. Deletion cannot guarantee that every third-party copy has disappeared.

## Setup

1. Apply `supabase-panic-migration.sql` in this project's SQL editor. It creates a service-role-only job lock and receipt table, allowing safe retries after partial failure and rejecting replayed confirmations.
2. Add the following **private Supabase Edge Function secrets**. Never put token values in this repository, `supabase-config.js`, screenshots or chat.

| Secret | Required value |
| --- | --- |
| `PANIC_GITHUB_TOKEN` | A fine-grained GitHub PAT restricted to `ensmbz/ensmbz.github.io` with **Administration: read and write**. |
| `PANIC_SUPABASE_MANAGEMENT_TOKEN` | A scoped Supabase Management API PAT restricted to `vuxenevtawplaklregbz`, with project read and **project_admin_write** permissions. A database service-role key cannot delete the project. |
| `PANIC_CLOUDFLARE_API_TOKEN` | Required only when R2 is configured. Cloudflare token for the configured account with bucket/object read and delete permissions. The R2 object-upload key alone is insufficient to delete a bucket. |
| `PANIC_DELETION_ENABLED` | Set to `true` only after the setup and deployment are complete. Omit it or set `false` to disarm full deletion. |

Keep the existing `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`, `DISCORD_APPLICATION_ID`, `DISCORD_REVIEW_CHANNEL_ID` and `DISCORD_PHOTO_ARCHIVE_CHANNEL_ID` secrets. The Supabase platform supplies the function's service-role key.

3. Deploy `dynamic-function`, including both `index.ts` and `panic.mjs`. CLI command:

```powershell
supabase functions deploy dynamic-function --project-ref vuxenevtawplaklregbz
```

4. Refresh the command description through the existing `register-site-command` endpoint, or leave the old description until registration is refreshed. Commands and old panic buttons both use the new owner checks and typed confirmation once the function is deployed.

## Behavior after confirmation

The function claims an atomic job lock, then checks access to all providers before starting deletion. It pauses the site, removes the bot's Discord posts, empties/removes any configured R2 bucket, deletes the GitHub repository, then requests Supabase project deletion **last**. Project deletion also stops the function itself, so the final Discord completion message may not arrive; a progress message is sent before that final request.

Completed steps are saved. If a provider rejects a deletion, the function stops and reports which steps already finished. Correct the access problem, invoke `/panic` again and submit a new confirmation to resume. A terminated worker's job lock expires after 15 minutes. Completed deletions are irreversible.

Do not test this against the production DELETE endpoints. The permission, confirmation, failure and retry paths are covered by `node --test tests/panic.test.mjs`, using mocked providers only.

Official API references: [GitHub repository deletion](https://docs.github.com/en/rest/repos/repos#delete-a-repository), [Supabase project deletion](https://supabase.com/docs/reference/api/v1-delete-a-project), [R2 bucket deletion](https://developers.cloudflare.com/r2/buckets/delete-buckets/).
