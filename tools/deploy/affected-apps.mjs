import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';

const apps = JSON.parse(readFileSync(new URL('./apps.json', import.meta.url), 'utf8'));
let selected = apps;

if (process.env.DEPLOY_EVENT !== 'workflow_dispatch') {
  const base = process.env.NX_BASE;
  const head = process.env.NX_HEAD;
  if (!base || !head) throw new Error('NX_BASE and NX_HEAD are required');

  const changed = execFileSync('git', ['diff', '--name-only', base, head], {
    encoding: 'utf8',
  }).split('\n');
  const deploymentChanged = changed.some(
    (path) => path.startsWith('.github/workflows/') || path.startsWith('tools/deploy/')
  );

  if (!deploymentChanged) {
    const affected = JSON.parse(
      execFileSync(
        'npx',
        [
          'nx',
          'show',
          'projects',
          '--affected',
          '--json',
          `--base=${base}`,
          `--head=${head}`,
        ],
        { encoding: 'utf8' }
      )
    );
    selected = apps.filter((app) => affected.includes(app.project));
  }
}

const matrix = JSON.stringify({ include: selected });
console.log(matrix);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `matrix=${matrix}\nhas_apps=${selected.length > 0}\n`
  );
}
