import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'ctrl_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(false);

  init(): void {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(prefersDark);
  }

  toggle(): void {
    this.apply(!this.isDark());
  }

  private apply(dark: boolean): void {
    this.isDark.set(dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('p-dark', dark);
  }
}
