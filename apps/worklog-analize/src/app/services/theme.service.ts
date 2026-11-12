import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  dark = signal(this.loadTheme());

  private document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const theme = this.dark() ? 'dark' : 'light';
      this.document.documentElement.dataset['theme'] = theme;
      try {
        localStorage.setItem('worklog-theme', theme);
      } catch {
        // The theme still works when storage is unavailable.
      }
    });
  }

  toggle(): void {
    this.dark.update((dark) => !dark);
  }

  private loadTheme(): boolean {
    try {
      return localStorage.getItem('worklog-theme') === 'dark';
    } catch {
      return false;
    }
  }
}
