import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { GroupPoints } from './interface';
import { DataService } from './services/data.service';

describe('AppComponent', () => {
  it('renders asynchronously loaded groups and descriptions without Zone.js change detection', async () => {
    const points = new Subject<GroupPoints[]>();
    const loadPoints = jest.fn(() => points);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DataService, useValue: { loadPoints } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('mat-checkbox')).toBeNull();

    points.next([
      {
        title: 'Packing',
        list: [{ text: 'Passport', description: 'Check expiry' }, { text: 'Tickets' }],
      },
    ]);
    await fixture.whenStable();
    expect(loadPoints).toHaveBeenCalledTimes(1);
    expect(element.querySelector('h2')?.textContent).toContain('Packing');
    expect(element.querySelectorAll('mat-checkbox')).toHaveLength(2);
    expect(element.querySelector('mat-checkbox')?.textContent).toContain('Passport');
    expect(element.querySelectorAll('.description')).toHaveLength(1);
    expect(element.querySelector('.description')?.textContent).toContain('Check expiry');

    const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.click();
    await fixture.whenStable();
    expect(input.checked).toBe(true);
    fixture.destroy();
    expect(points.observed).toBe(false);
  });
});
