# Checklist

An Angular app that displays grouped checklists from a Google spreadsheet. Each item has a checkbox and an optional description. Checkmarks are kept only while the page is open; they are not saved or sent to the spreadsheet.

## Development

Run commands from the repository root after installing the workspace dependencies:

```sh
npx nx serve check-list
npx nx build check-list
npx nx test check-list --runInBand
npx nx lint check-list
```

The development server uses `http://localhost:4200` by default. Production builds are written to `dist/apps/check-list`. To build with source maps and without production optimization, run `npx nx build check-list --configuration=development`.

## Spreadsheet configuration

Set `doc` (the spreadsheet ID) and `gridId` (the sheet's `gid`) in `src/environments/environment.ts` for development and `src/environments/environment.prod.ts` for production. The production build replaces the development environment file automatically.

The spreadsheet must be readable without signing in. The app requests its Google Visualization endpoint directly from the browser; it does not use an API key or a backend.

| Column | Contents                                              |
| ------ | ----------------------------------------------------- |
| A      | Group heading. A nonempty cell starts a new group.    |
| B      | Checklist item text, on a row with an empty column A. |
| C      | Optional item description.                            |

Rows without headings or item text are ignored. Items before the first group heading are also ignored. A row with a heading starts a group; put its items on subsequent rows.

## Deployment

The shared GitHub Actions workflow deploys this app to
[check-list.apilab.ru](http://check-list.apilab.ru) over FTP after affected changes
reach `master`. It can also be run manually as **Deploy affected apps**.

The app is registered in `tools/deploy/apps.json` with the
`check-list-production` environment, build output `dist/apps/check-list`, and
FTP target `/check-list.apilab.ru/current`. Configure its four FTP environment
secrets as described in [the deployment guide](../../tools/deploy/README.md#checklist).
