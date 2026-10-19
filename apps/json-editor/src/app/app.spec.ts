import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { filter, firstValueFrom, of } from 'rxjs';
import { saveAsFile } from '@store';
import { appConfig } from './app.config';
import { AppComponent } from './components/root/app.component';
import { JsonDataService } from './services/json-data.service';
import type { JsonData, JsonFile } from './interface';
import example from './examples/example.json';
import { PageScrollService } from 'ngx-page-scroll-core';

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
      value: [new File(['{"imported":true}'], 'imported.json', { type: 'application/json' })],
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
    const input = rows[1].querySelector('input:not([formcontrolname])') as HTMLInputElement;
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
    expect(saveAsFile).toHaveBeenCalledWith('{"section":{"value":"after"}}', 'example.json');
    Array.from(element.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Delete file'))!
      .click();
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
      router.events.pipe(filter((event) => event instanceof NavigationEnd && event.urlAfterRedirects === '/edit/8'))
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

  it('uses ### paths and preserves dotted keys when navigating, editing and saving', async () => {
    const nested = { 'profile.settings': { 'contact.info': { 'email.address': 'before' } } };
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
    (element.querySelectorAll('je-json-row')[1].querySelector('.value.-object') as HTMLElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.parseUrl(router.url).queryParams.path).toBe('profile.settings###contact.info');
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
