# Deploy apps

`.github/workflows/deploy-apps.yml` runs on pushes to `master` and manual runs.
It uses Nx to select enabled apps affected by changed app code, shared libraries,
and workspace configuration. The comparison starts at the last successful run
of this workflow, so failed deployments are retried on subsequent pushes.
Manual runs and deployment configuration changes select every enabled app.

`json-editor`, `time`, and `check-list` are enabled in `apps.json`. To enable another static app, add
its Nx project name, production output directory, and FTP target directory there.
The shared workflow builds each selected app and deploys its artifact via FTP,
using the same lftp settings as the existing apilab-main workflow.

## GitHub setup

All apps use one shared FTP account. Configure it once in
`apilab-ru/frontend-monorepo` under **Settings → Secrets and variables → Actions**:

- Repository secret `FTP_PASSWORD`: the `sites_deploy` FTP account password from
  `/root/.config/apilab-deploy/ftp.json`. Do not use the root SSH password.
- Optional repository variables `FTP_SERVER` and `FTP_USERNAME`: override the
  defaults `ftp://92.53.119.95` and `sites_deploy` for all apps.

Existing repository secrets `FTP_SERVER` and `FTP_USERNAME` also work and take
precedence over repository variables. The workflows use repository settings;
per-project GitHub environments and environment secrets are not used. If the
FTP password was previously configured only in an environment, add it as the
shared repository secret. Secrets in other repositories are not shared here.

Each app's `ftp_target_dir` is stored in `apps.json` and passed directly to the
deployment workflow. `FTP_TARGET_DIR` secrets and variables are intentionally
ignored so a shared setting cannot send different apps to the same directory.

The workflow validates configuration before downloading artifacts or connecting
to FTP. If a value is missing, it reports the variable and project name without
printing any credentials.

Deploy only to the dedicated site's `current` directory: synchronization removes
remote files absent from the build output. The target must already exist. The
workflow checks this before uploading and rejects broad root paths.

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
repository secrets using an authenticated administrative GitHub session.
Do not commit this file or print its contents in CI logs.

For another site, reuse the FTP account and configure its own target in `apps.json`,
for example `/time.apilab.ru/current`. Deploy only to the dedicated site's
`current` directory, since synchronization deletes stale files there.

`json.apilab.ru` already has an Nginx virtual host rooted at
`/var/www/json.apilab.ru/current`, with SPA fallback and cache headers configured.
No Nginx changes or Apache installation are needed for this server.

## Time

Time outputs `dist/apps/time` and uses the shared repository FTP credentials.
The deployment matrix sets its FTP target to `/time.apilab.ru/current`.
Configure `FTP_PASSWORD` as described above. Production includes the production environment and
Angular service-worker files. The origin has HTTPS configured for time.apilab.ru.

## Checklist

Checklist outputs `dist/apps/check-list` and uses the shared repository FTP
credentials. The deployment matrix sets `ftp_target_dir` to
`/check-list.apilab.ru/current`; no app-specific credentials or GitHub
environment are required.

The existing Nginx virtual host serves `check-list.apilab.ru` from
`/var/www/check-list.apilab.ru/current` with SPA fallback. The relative `current`
symlink resolves inside the FTP jail, and the deployment account has write
access to its release directory and files. No Nginx or permission changes are
needed. The current virtual host listens on HTTP port 80.

Push these changes to `master` to deploy affected apps, or run **Deploy affected
apps** manually to deploy all enabled apps. The workflow builds on Ubuntu and
verifies the uploaded `index.html` against the build artifact.
