export function parseSpreadsheetUrl(value: string): { doc: string; gridId: string } {
  let url: URL;

  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('Enter a valid Google Sheets URL.');
  }

  const doc = url.pathname.match(
    /^\/spreadsheets\/(?:u\/\d+\/)?d\/([\w-]+)(?:\/|$)/
  )?.[1];
  const gridId =
    new URLSearchParams(url.hash.slice(1)).get('gid') ??
    url.searchParams.get('gid') ??
    '0';

  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'docs.google.com' ||
    !doc ||
    !/^\d+$/.test(gridId)
  ) {
    throw new Error('Enter a Google Sheets URL with a valid spreadsheet and sheet ID.');
  }

  return { doc, gridId };
}
