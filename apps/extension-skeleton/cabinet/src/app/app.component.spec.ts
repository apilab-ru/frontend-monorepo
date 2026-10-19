import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserModule } from '@shared/user';
import { UserService } from '@shared/user/services/user.service';
import { AppComponent } from './app.component';
import { CabinetService } from './services/cabinet.service';

describe('AppComponent', () => {
  const cabinetService = {
    repos$: of([]), counter$: of(0),
    increment: jest.fn(), decrement: jest.fn(),
  };
  const userService = { user$: of(null), updateUser: jest.fn(() => of(undefined)) };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [CommonModule, UserModule],
      declarations: [AppComponent],
      providers: [
        { provide: CabinetService, useValue: cabinetService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();
  });

  it('renders the cabinet and updates the counter through its buttons', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h2')?.textContent).toContain('Welcome to cabinet');
    const buttons = element.querySelectorAll('button');
    Array.from(buttons).find(button => button.textContent?.includes('Increment'))!.click();
    Array.from(buttons).find(button => button.textContent?.includes('Decrement'))!.click();
    expect(cabinetService.increment).toHaveBeenCalledTimes(1);
    expect(cabinetService.decrement).toHaveBeenCalledTimes(1);
  });

  it('forwards user changes to the user service', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const user = { name: 'Test user', git: 'test' };
    fixture.componentInstance.updateUser(user);
    expect(userService.updateUser).toHaveBeenCalledWith(user);
  });
});
