import { parseSpreadsheetUrl } from './spreadsheet-url';

describe('parseSpreadsheetUrl', () => {
  it('extracts the spreadsheet ID and the tab from the hash or query', () => {
    expect(
      parseSpreadsheetUrl('https://docs.google.com/spreadsheets/d/my-sheet/edit#gid=42')
    ).toEqual({ doc: 'my-sheet', gridId: '42' });
    expect(
      parseSpreadsheetUrl('https://docs.google.com/spreadsheets/d/my-sheet/edit?gid=7')
    ).toEqual({ doc: 'my-sheet', gridId: '7' });
    expect(
      parseSpreadsheetUrl('https://docs.google.com/spreadsheets/d/my-sheet/')
    ).toEqual({ doc: 'my-sheet', gridId: '0' });
  });
  it.each([
    'invalid',
    'https://example.com/spreadsheets/d/sheet/edit',
    'https://docs.google.com/document/d/doc/edit',
    'https://docs.google.com/spreadsheets/d/sheet/edit#gid=invalid',
  ])('rejects %s', (url) => {
    expect(() => parseSpreadsheetUrl(url)).toThrow();
  });
});
