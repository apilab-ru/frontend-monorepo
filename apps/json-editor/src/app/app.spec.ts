import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, firstValueFrom, of } from 'rxjs';
import { saveAsFile } from '@store';
import { appConfig } from './app.config';
import { AppComponent } from './components/root/app.component';
import { JsonDataService } from './services/json-data.service';
import type { JsonData, JsonFile } from './interface';
import example from './examples/example.json';
import { PageScrollService } from 'ngx-page-scroll-core';
import { PATH_SEPARATOR } from './const';

jest.mock('@store', () => ({ ...jest.requireActual('@store'), saveAsFile: jest.fn() }));

describe('Standalone JSON Editor', () => {
  const data = { section: { value: 'before' } };
  const service = {
    files$: of<JsonFile[]>([{ id: 7, name: 'example.json', data }]),
    fileNames$: of([{ id: 7, name: 'example.json' }]),
    loadFileData: jest.fn(() => of<JsonData>(data)),
    addFile: jest.fn().mockResolvedValue(undefined),
    updateFile: jest.fn().mockResolvedValue(undefined),
    deleteFile: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    service.loadFileData.mockReset().mockImplementation(() => of(data));
    service.addFile.mockReset().mockResolvedValue(undefined);
    data.section.value = 'before';
    service.files$ = of([{ id: 7, name: 'example.json', data }]);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        ...appConfig.providers,
        { provide: JsonDataService, useValue: service },
        { provide: PageScrollService, useValue: { scroll: jest.fn() } },
      ],
    }).compileComponents();
  });

  it('renders navigation and imports a JSON file through the standalone upload route', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/addFile');
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('je-menu')?.textContent).toContain('example.json');
    const input = element.querySelector('input[type=file]') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      value: [
        new File(['{"imported":true}'], 'imported.json', { type: 'application/json' }),
      ],
    });
    const imported = new Promise<void>((resolve) => {
      service.addFile.mockImplementationOnce(() => {
        resolve();

        return Promise.resolve();
      });
    });
    input.dispatchEvent(new Event('input'));
    await imported;
    expect(service.addFile).toHaveBeenCalledWith({ imported: true }, 'imported.json');
  });

  it('loads a nested path, saves an edit, and navigates back after deleting the file', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/edit/7?path=section');
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const rows = element.querySelectorAll('je-json-row');
    expect(rows).toHaveLength(2);
    expect(service.loadFileData).toHaveBeenCalledWith(7);
    const input = rows[1].querySelector(
      'input:not([formcontrolname])'
    ) as HTMLInputElement;
    expect(input.value).toBe('before');
    input.value = 'after';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const save = Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Save changes')
    );
    expect(save).toBeDefined();
    save!.click();
    expect(service.updateFile).toHaveBeenCalledWith({
      id: 7,
      name: 'example.json',
      data: { section: { value: 'after' } },
    });
    expect(saveAsFile).toHaveBeenCalledWith(
      '{"section":{"value":"after"}}',
      'example.json'
    );
    const deleted = firstValueFrom(
      router.events.pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd && event.urlAfterRedirects === '/addFile'
        )
      )
    );
    Array.from(element.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Delete file'))!
      .click();
    await deleted;
    await fixture.whenStable();
    expect(service.deleteFile).toHaveBeenCalledWith(7);
    expect(router.url).toBe('/addFile');
  });

  it('loads the bundled example and opens the newly created file', async () => {
    service.addFile.mockResolvedValueOnce({ id: 8, name: 'example.json', data: example });
    service.loadFileData.mockReturnValue(of(example));
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/addFile');
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const button = Array.from(element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Example'
    );
    const opened = firstValueFrom(
      router.events.pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd && event.urlAfterRedirects === '/edit/8'
        )
      )
    );
    button!.click();
    await opened;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(service.addFile).toHaveBeenCalledWith(example, 'example.json');
    expect(service.addFile.mock.calls[0][0]).not.toBe(example);
    expect(router.url).toBe('/edit/8');
    expect(service.loadFileData).toHaveBeenCalledWith(8);
    expect(element.querySelector('je-json-row')?.textContent).toContain('catalog');
  });

  it('filters keys, inspects a selected value and saves edits at the root', async () => {
    const rootData = { title: 'Before', description: 'Another field' };
    service.loadFileData.mockReturnValue(of(rootData));
    service.files$ = of([{ id: 7, name: 'example.json', data: rootData }]);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/edit/7');
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const search = element.querySelector(
      'input[formcontrolname="search"]'
    ) as HTMLInputElement;
    search.value = 'TITLE';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.querySelectorAll('je-json-row .field')).toHaveLength(1);
    const input = element.querySelector(
      'input[aria-label="Edit title"]'
    ) as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((element.querySelector('#inspector-key') as HTMLInputElement).value).toBe(
      'title'
    );
    expect(
      JSON.parse((element.querySelector('#inspector-json') as HTMLTextAreaElement).value)
    ).toEqual('Before');
    expect((element.querySelector('.preview') as HTMLTextAreaElement)?.value).toContain(
      'Before'
    );
    input.value = 'After';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((element.querySelector('.preview') as HTMLTextAreaElement)?.value).toContain(
      'After'
    );
    (element.querySelector('button.save') as HTMLButtonElement).click();
    expect(service.updateFile).toHaveBeenCalledWith({
      id: 7,
      name: 'example.json',
      data: { title: 'After', description: 'Another field' },
    });
  });

  async function openInspector(data: JsonData, path = '', source = of(data)) {
    service.loadFileData.mockReturnValue(source);
    service.files$ = of([{ id: 7, name: 'example.json', data }]);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/edit/7?path=' + encodeURIComponent(path));
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const input = (selector: string, value: string) => {
      const control = element.querySelector(selector) as HTMLInputElement;
      control.value = value;
      control.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    const apply = () => {
      (element.querySelector('.inspector button.apply') as HTMLButtonElement).click();
      fixture.detectChanges();
    };

    return { fixture, router, element, input, apply };
  }

  it.each([
    ['section', 'section', { value: 'before', items: [false, null] }, 2],
    [['section', 'value'].join(PATH_SEPARATOR), 'value', 'before', 2],
    [['section', 'items', '0'].join(PATH_SEPARATOR), '0', false, 3],
    [['section', 'items', '1'].join(PATH_SEPARATOR), '1', null, 3],
  ])(
    'restores the selected field from URL path %s',
    async (path, key, value, columns) => {
      const { element } = await openInspector(
        { section: { value: 'before', items: [false, null] } },
        path as string
      );
      expect(element.querySelectorAll('je-json-row')).toHaveLength(columns as number);
      expect((element.querySelector('#inspector-key') as HTMLInputElement).value).toBe(
        key
      );
      expect(
        JSON.parse(
          (element.querySelector('#inspector-json') as HTMLTextAreaElement).value
        )
      ).toEqual(value);
      expect(element.querySelectorAll('je-json-row .field.-selected')).toHaveLength(
        (path as string).split(PATH_SEPARATOR).length
      );
    }
  );

  it('writes scalar selections to the URL and restores selection on URL navigation', async () => {
    const { fixture, element, router } = await openInspector({
      title: 'Hello',
      nested: { 'dotted.key': 42 },
    });
    (element.querySelector('input[aria-label="Edit title"]') as HTMLInputElement).focus();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.parseUrl(router.url).queryParams.path).toBe('title');
    await router.navigateByUrl(
      '/edit/7?path=' + encodeURIComponent(['nested', 'dotted.key'].join(PATH_SEPARATOR))
    );
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((element.querySelector('#inspector-key') as HTMLInputElement).value).toBe(
      'dotted.key'
    );
    expect(
      JSON.parse((element.querySelector('#inspector-json') as HTMLTextAreaElement).value)
    ).toBe(42);
    expect(element.querySelectorAll('je-json-row')).toHaveLength(2);
  });

  it('restores the URL selection when saved file data arrives asynchronously', async () => {
    const loaded = new BehaviorSubject<JsonData>(null);
    service.loadFileData.mockReturnValue(loaded);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl(
      '/edit/7?path=' + encodeURIComponent(['section', 'value'].join(PATH_SEPARATOR))
    );
    await fixture.whenStable();
    fixture.detectChanges();
    loaded.next({ section: { value: 0 } });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('je-json-row')).toHaveLength(2);
    expect((element.querySelector('#inspector-key') as HTMLInputElement).value).toBe(
      'value'
    );
    expect(
      JSON.parse((element.querySelector('#inspector-json') as HTMLTextAreaElement).value)
    ).toBe(0);
  });

  it('preserves edits made while an earlier save is pending', async () => {
    const original = { title: 'Original' };
    const loaded = new BehaviorSubject<JsonData>(original);
    const { fixture, element, input } = await openInspector(original, '', loaded);
    let finishSave: () => void;
    const saved = new Promise<void>((resolve) => {
      finishSave = resolve;
    });
    service.updateFile.mockReturnValueOnce(saved);
    input('input[aria-label="Edit title"]', 'First edit');
    (element.querySelector('button.save') as HTMLButtonElement).click();
    const submitted = service.updateFile.mock.calls[0][0];
    input('input[aria-label="Edit title"]', 'Latest edit');
    loaded.next(submitted.data);
    fixture.detectChanges();
    finishSave!();
    await saved;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(
      (element.querySelector('input[aria-label="Edit title"]') as HTMLInputElement).value
    ).toBe('Latest edit');
    expect(element.querySelector('button.save')).not.toBeNull();
    expect(original).toEqual({ title: 'Original' });
  });

  it('retains unsaved edits during path navigation and resets the draft when switching files', async () => {
    const { fixture, element, router, input } = await openInspector({
      title: 'Original',
      nested: { value: 1 },
    });
    input('input[aria-label="Edit title"]', 'Unsaved');
    await router.navigateByUrl('/edit/7?path=nested');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.querySelector('button.save')).not.toBeNull();
    expect(
      (element.querySelector('input[aria-label="Edit title"]') as HTMLInputElement).value
    ).toBe('Unsaved');
    service.loadFileData.mockReturnValueOnce(of({ title: 'Second file' }));
    await router.navigateByUrl('/edit/8');
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(
      (element.querySelector('input[aria-label="Edit title"]') as HTMLInputElement).value
    ).toBe('Second file');
    expect(element.querySelector('button.save')).toBeNull();
  });

  it('opens only existing own fields for an invalid URL path', async () => {
    const { element } = await openInspector(
      { section: { value: 1 } },
      ['section', 'missing', 'child'].join(PATH_SEPARATOR)
    );
    expect((element.querySelector('#inspector-key') as HTMLInputElement).value).toBe(
      'section'
    );
    expect(element.querySelectorAll('je-json-row')).toHaveLength(2);
  });

  it('renames an open object and applies typed JSON without mutating the stored file before save', async () => {
    const original = { 'old.key': { count: 1 }, sibling: true };
    const { fixture, router, element, input, apply } = await openInspector(original);
    (
      element.querySelector('button[aria-label="Explore old.key"]') as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    input('#inspector-key', 'new.key');
    input(
      '#inspector-json',
      '{"count":2,"enabled":false,"optional":null,"items":[1,"two"]}'
    );
    apply();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.parseUrl(router.url).queryParams.path).toBe('new.key');
    expect(element.querySelectorAll('je-json-row')).toHaveLength(2);
    expect(element.querySelectorAll('je-json-row')[1].textContent).toContain('enabled');
    await fixture.whenStable();
    fixture.detectChanges();
    expect((element.querySelector('#inspector-key') as HTMLInputElement).value).toBe(
      'new.key'
    );
    expect(original).toEqual({ 'old.key': { count: 1 }, sibling: true });
    expect(service.updateFile).not.toHaveBeenCalled();
    (element.querySelector('button.save') as HTMLButtonElement).click();
    expect(service.updateFile).toHaveBeenCalledWith({
      id: 7,
      name: 'example.json',
      data: {
        'new.key': { count: 2, enabled: false, optional: null, items: [1, 'two'] },
        sibling: true,
      },
    });
  });

  it('keeps invalid JSON and duplicate names out of the document and repairs columns after a type change', async () => {
    const { fixture, router, element, input, apply } = await openInspector({
      section: { count: 1 },
      taken: 'safe',
    });
    (
      element.querySelector('button[aria-label="Explore section"]') as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    fixture.detectChanges();
    input('#inspector-json', '{invalid');
    apply();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('valid JSON');
    expect(element.querySelector('button.save')).toBeNull();
    input('#inspector-json', 'false');
    input('#inspector-key', 'taken');
    apply();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'already exists'
    );
    expect((element.querySelector('#inspector-json') as HTMLTextAreaElement).value).toBe(
      'false'
    );
    expect(element.querySelector('button.save')).toBeNull();
    input('#inspector-key', 'section');
    apply();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.querySelectorAll('je-json-row')).toHaveLength(1);
    expect(router.parseUrl(router.url).queryParams.path).toBe('section');
    expect(
      JSON.parse((element.querySelector('#inspector-json') as HTMLTextAreaElement).value)
    ).toBe(false);
    (element.querySelector('button.save') as HTMLButtonElement).click();
    expect(service.updateFile).toHaveBeenCalledWith({
      id: 7,
      name: 'example.json',
      data: { section: false, taken: 'safe' },
    });
  });

  it('edits array entries in the inspector while keeping their indexes fixed', async () => {
    const { fixture, element, input, apply } = await openInspector({
      items: ['before', 2],
    });
    (
      element.querySelector('button[aria-label="Explore items"]') as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    (
      element.querySelector('input[aria-label="Edit 0"]') as HTMLInputElement
    ).dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((element.querySelector('#inspector-key') as HTMLInputElement).disabled).toBe(
      true
    );
    input('#inspector-json', 'null');
    apply();
    expect(
      JSON.parse((element.querySelector('#inspector-json') as HTMLTextAreaElement).value)
    ).toBeNull();
    (element.querySelector('button.save') as HTMLButtonElement).click();
    expect(service.updateFile).toHaveBeenCalledWith({
      id: 7,
      name: 'example.json',
      data: { items: [null, 2] },
    });
  });

  it('uses the configured path separator and preserves dotted keys when navigating, editing and saving', async () => {
    const nested = {
      'profile.settings': { 'contact.info': { 'email.address': 'before' } },
    };
    service.loadFileData.mockReturnValue(of(nested));
    service.files$ = of([{ id: 7, name: 'example.json', data: nested }]);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/edit/7');
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    (element.querySelector('je-json-row .value.-object') as HTMLElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    (
      element
        .querySelectorAll('je-json-row')[1]
        .querySelector('.value.-object') as HTMLElement
    ).click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.parseUrl(router.url).queryParams.path).toBe(
      ['profile.settings', 'contact.info'].join(PATH_SEPARATOR)
    );
    expect(router.parseUrl(router.url).fragment).toBeNull();
    const rows = element.querySelectorAll('je-json-row');
    expect(rows).toHaveLength(3);
    const input = rows[2].querySelector('.value.-simple input') as HTMLInputElement;
    expect(input.value).toBe('before');
    input.value = 'after';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    Array.from(element.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Save changes'))!
      .click();
    expect(service.updateFile).toHaveBeenCalledWith({
      id: 7,
      name: 'example.json',
      data: { 'profile.settings': { 'contact.info': { 'email.address': 'after' } } },
    });
    (element.querySelector('.paths .path') as HTMLElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.parseUrl(router.url).queryParams.path).toBe('profile.settings');
    expect(element.querySelectorAll('je-json-row')).toHaveLength(2);
  });
});
