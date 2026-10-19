import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';

describe('AppComponent', () => {
  it('renders groups and checklist items returned by the data service', async () => {
    const loadPoints = jest.fn(() => of([
      { title: 'Packing', list: [{ text: 'Passport', description: 'Check expiry' }] },
    ]));
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatCheckboxModule, NoopAnimationsModule],
      declarations: [AppComponent],
      providers: [{ provide: DataService, useValue: { loadPoints } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(loadPoints).toHaveBeenCalledTimes(1);
    expect(element.querySelector('h2')?.textContent).toContain('Packing');
    expect(element.querySelector('mat-checkbox')?.textContent).toContain('Passport');
    expect(element.querySelector('.description')?.textContent).toContain('Check expiry');
  });
});
