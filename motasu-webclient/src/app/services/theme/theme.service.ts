import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = signal(false);

  constructor() {
    // Vérifier les préférences du navigateur au démarrage
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkTheme.set(prefersDark);

      // Écouter les changements de préférences
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.isDarkTheme.set(e.matches);
      });
    }

    // Appliquer le thème au body
    effect(() => {
      if (typeof document !== 'undefined') {
        if (this.isDarkTheme()) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      }
    });
  }

  get isDark() {
    return this.isDarkTheme;
  }

  toggleTheme() {
    this.isDarkTheme.set(!this.isDarkTheme());
  }
}