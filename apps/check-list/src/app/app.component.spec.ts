import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { GroupPoints } from './interface';
import { DataService } from './services/data.service';

const SAVED_URL = 'https://docs.google.com/spreadsheets/d/saved-sheet/edit#gid=42';
const GROUPS: GroupPoints[] = [
  {
    title: 'Packing',
    list: [{ text: 'Passport', description: 'Check expiry' }, { text: 'Tickets' }],
  },
];

describe('AppComponent', () => {
  let loadPoints: jest.Mock;

  beforeEach(async () => {
    localStorage.clear();
    loadPoints = jest.fn(() => of(GROUPS));
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DataService, useValue: { loadPoints } },
      ],
    }).compileComponents();
  });

  async function create(): Promise<ComponentFixture<AppComponent>> {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    return fixture;
  }

  function setUrl(fixture: ComponentFixture<AppComponent>, url: string): void {
    const input = fixture.nativeElement.querySelector('#sheet-url') as HTMLInputElement;
    input.value = url;
    input.dispatchEvent(new Event('input'));
  }

  it('renders asynchronous data and cleans up its subscription', async () => {
    const response = new Subject<GroupPoints[]>();
    loadPoints.mockReturnValue(response);
    const fixture = await create();
    expect(
      fixture.nativeElement.querySelector('.checklist-content').getAttribute('aria-busy'),
    ).toBe('true');
    expect(
      fixture.nativeElement.querySelector('.skeleton-groups').getAttribute('aria-hidden'),
    ).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('.skeleton-checkbox')).toHaveLength(8);
    expect(fixture.nativeElement.querySelector('.checklist-checkbox')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'Loading checklist',
    );
    expect(fixture.nativeElement.querySelector('#sheet-url').value).toBe(
      loadPoints.mock.calls[0][0],
    );
    response.next(GROUPS);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.skeleton-groups')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.checklist-content').getAttribute('aria-busy'),
    ).toBe('false');
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Packing');
    expect(fixture.nativeElement.querySelectorAll('.checklist-checkbox')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.description').textContent).toContain(
      'Check expiry',
    );
    fixture.destroy();
    expect(response.observed).toBe(false);
  });

  it('shows skeletons again while loading another spreadsheet', async () => {
    const fixture = await create();
    const response = new Subject<GroupPoints[]>();
    loadPoints.mockReturnValue(response);
    setUrl(fixture, SAVED_URL);
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.skeleton-groups')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.checklist-checkbox')).toBeNull();
    response.next([{ title: 'New list', list: [{ text: 'New item' }] }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.skeleton-groups')).toBeNull();
    expect(fixture.nativeElement.querySelector('.group-title').textContent).toContain(
      'New list',
    );
    expect(fixture.componentInstance.totalCount()).toBe(1);
  });

  it('starts with the format example collapsed and expands and collapses it', async () => {
    const fixture = await create();
    const button = fixture.nativeElement.querySelector(
      '.example-toggle',
    ) as HTMLButtonElement;
    const example = fixture.nativeElement.querySelector('#format-example') as HTMLElement;
    expect(example.hidden).toBe(true);
    button.click();
    await fixture.whenStable();
    expect(example.hidden).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(example.querySelectorAll('tbody tr')).toHaveLength(6);
    button.click();
    await fixture.whenStable();
    expect(example.hidden).toBe(true);
  });

  it('counts checked items and resets them', async () => {
    const fixture = await create();
    const checkbox = fixture.nativeElement.querySelector(
      '.checklist-checkbox',
    ) as HTMLInputElement;
    checkbox.click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('footer').textContent).toContain(
      '1 of 2 checked',
    );
    fixture.nativeElement.querySelector('.reset-button').click();
    await fixture.whenStable();
    expect(checkbox.checked).toBe(false);
    expect(fixture.componentInstance.checkedCount()).toBe(0);
  });

  it('selects and clears every item across groups using the logo checkbox', async () => {
    loadPoints.mockReturnValue(
      of([...GROUPS, { title: 'Before leaving', list: [{ text: 'Lock the door' }] }]),
    );
    const fixture = await create();
    const logo = fixture.nativeElement.querySelector(
      '.brand-checkbox',
    ) as HTMLInputElement;
    expect(logo.checked).toBe(false);
    logo.click();
    await fixture.whenStable();
    expect(logo.checked).toBe(true);
    expect(fixture.componentInstance.checkedCount()).toBe(3);
    expect(
      Array.from(
        fixture.nativeElement.querySelectorAll(
          '.checklist-checkbox',
        ) as NodeListOf<HTMLInputElement>,
      ).every((input) => input.checked),
    ).toBe(true);
    logo.click();
    await fixture.whenStable();
    expect(logo.checked).toBe(false);
    expect(fixture.componentInstance.checkedCount()).toBe(0);
  });

  it('keeps the logo synchronized with individual items and Reset', async () => {
    const fixture = await create();
    const logo = fixture.nativeElement.querySelector(
      '.brand-checkbox',
    ) as HTMLInputElement;
    const items = fixture.nativeElement.querySelectorAll(
      '.checklist-checkbox',
    ) as NodeListOf<HTMLInputElement>;
    items[0].click();
    await fixture.whenStable();
    expect(logo.checked).toBe(false);
    expect(logo.indeterminate).toBe(true);
    items[1].click();
    await fixture.whenStable();
    expect(logo.checked).toBe(true);
    expect(logo.indeterminate).toBe(false);
    items[0].click();
    await fixture.whenStable();
    expect(logo.checked).toBe(false);
    expect(logo.indeterminate).toBe(true);
    logo.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.checkedCount()).toBe(2);
    fixture.nativeElement.querySelector('.reset-button').click();
    await fixture.whenStable();
    expect(logo.checked).toBe(false);
    expect(logo.indeterminate).toBe(false);
  });

  it('disables the logo checkbox for an empty checklist', async () => {
    loadPoints.mockReturnValue(of([]));
    const fixture = await create();
    const logo = fixture.nativeElement.querySelector(
      '.brand-checkbox',
    ) as HTMLInputElement;
    expect(logo.disabled).toBe(true);
    expect(logo.checked).toBe(false);
    expect(fixture.componentInstance.allChecked()).toBe(false);
  });

  it('saves a submitted link and uses the saved link on the next visit', async () => {
    const fixture = await create();
    const input = fixture.nativeElement.querySelector('#sheet-url') as HTMLInputElement;
    input.value = SAVED_URL;
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(loadPoints).toHaveBeenLastCalledWith(SAVED_URL);
    expect(localStorage.getItem('check-list.spreadsheet-url')).toBe(SAVED_URL);
    fixture.destroy();
    const restored = await create();
    expect(restored.componentInstance.sheetUrl.value).toBe(SAVED_URL);
    expect(loadPoints).toHaveBeenLastCalledWith(SAVED_URL);
  });

  it('rejects invalid links without saving or requesting them', async () => {
    const fixture = await create();
    setUrl(fixture, 'https://example.com/not-a-sheet');
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(loadPoints).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('check-list.spreadsheet-url')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Google Sheets URL',
    );
  });

  it('keeps validation errors under the URL separate from loading errors', async () => {
    loadPoints.mockReturnValueOnce(throwError(() => new Error('Network error')));
    const fixture = await create();
    const loadingError = fixture.componentInstance.error();
    setUrl(fixture, 'invalid');
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('.sheet-field #sheet-url-error').textContent,
    ).toContain('Google Sheets URL');
    expect(
      fixture.nativeElement.querySelector('#sheet-url').getAttribute('aria-describedby'),
    ).toBe('sheet-url-error');
    expect(fixture.componentInstance.error()).toBe(loadingError);
    expect(fixture.nativeElement.querySelector('#load-error').textContent).toContain(
      'Could not load',
    );
    setUrl(fixture, SAVED_URL);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('#sheet-url-error')).toBeNull();
    expect(fixture.componentInstance.error()).toBe(loadingError);
  });

  it('revalidates the control while editing without issuing another request', async () => {
    const fixture = await create();
    const input = fixture.nativeElement.querySelector('#sheet-url') as HTMLInputElement;
    input.value = 'invalid';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();

    input.value = SAVED_URL;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.sheetUrl.valid).toBe(true);
    expect(fixture.componentInstance.sheetUrl.getError('spreadsheetUrl')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(loadPoints).toHaveBeenCalledTimes(1);
  });

  it('recovers from a failed load when the user submits a new link', async () => {
    loadPoints.mockReturnValueOnce(throwError(() => new Error('Network error')));
    const fixture = await create();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Could not load',
    );
    setUrl(fixture, SAVED_URL);
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(fixture.componentInstance.totalCount()).toBe(2);
  });

  it('ignores invalid saved links', async () => {
    localStorage.setItem('check-list.spreadsheet-url', 'invalid');
    const fixture = await create();
    expect(fixture.componentInstance.sheetUrl.value).toBe(
      fixture.componentInstance.exampleUrl,
    );
    expect(loadPoints).toHaveBeenCalledWith(fixture.componentInstance.exampleUrl);
  });

  it('continues loading when localStorage is unavailable', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    const fixture = await create();
    setUrl(fixture, SAVED_URL);
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { cancelable: true }));
    expect(loadPoints).toHaveBeenLastCalledWith(SAVED_URL);
    jest.restoreAllMocks();
  });
});
