# Deploy apps

`.github/workflows/deploy-apps.yml` runs on pushes to `master` and manual runs.
It uses Nx to select enabled apps affected by changed app code, shared libraries,
and workspace configuration. The comparison starts at the last successful run
of this workflow, so failed deployments are retried on subsequent pushes.
Manual runs and deployment configuration changes select every enabled app.

Only `json-editor` is enabled in `apps.json`. To enable another static app, add
its Nx project name, production output directory, and GitHub environment there.
The shared workflow builds each selected app and deploys its artifact via FTP,
using the same lftp settings as the existing apilab-main workflow.

## GitHub setup

In `apilab-ru/frontend-monorepo`, create the environment
`json-editor-production` under Settings → Environments. Add these environment
secrets (they are not automatically shared with the next-apps repository):

- `FTP_SERVER`: `ftp://92.53.119.95`.
- `FTP_USERNAME`: `sites_deploy`.
- `FTP_PASSWORD`: generated deployment account password.
- `FTP_TARGET_DIR`: `/json.apilab.ru/current` (relative to the FTP jail).

Use json-editor's actual directory, not apilab-main's directory. Deployment
removes remote files absent from the build output. The target must already
exist. The workflow checks this before uploading and rejects broad root paths.

Commit/push the workflow to `master`, then select Actions → Deploy affected apps
→ Run workflow for the initial deployment. Later pushes deploy affected enabled
apps automatically. No server-side webhook listener is required.

The production output is `dist/apps/json-editor`. Hidden artifact files are
included so the Apache `.htaccess` SPA routing configuration reaches the server.
The server must serve this directory as the site's document root and support
the supplied Apache rewrite rules, or provide equivalent SPA routing.

Deployment uploads files first, then removes stale files, and downloads
`index.html` to compare it against the build artifact. Uploads are not atomic;
the previous working FTP synchronization behavior is retained.

## Server configuration

The existing vsftpd service on `92.53.119.95` provides FTP access. The
`sites_deploy` account is confined to `/var/www`, has no interactive shell,
and belongs to the existing `loader` group. Website document roots owned by
that group allow group writes; directories inherit the group for new uploads.
Existing `current` symlinks use relative targets so they work inside the FTP
jail while still resolving to their original release directories for Nginx.

Generated credentials are stored only on the server in
`/root/.config/apilab-deploy/ftp.json` (mode 600). They must be copied into GitHub
environment secrets using an authenticated administrative GitHub session.
Do not commit this file or print its contents in CI logs.

For another site, reuse the FTP account and use its own environment and target,
for example `/time.apilab.ru/current`. Deploy only to the dedicated site's
`current` directory, since synchronization deletes stale files there.

`json.apilab.ru` already has an Nginx virtual host rooted at
`/var/www/json.apilab.ru/current`, with SPA fallback and cache headers configured.
No Nginx changes or Apache installation are needed for this server.
