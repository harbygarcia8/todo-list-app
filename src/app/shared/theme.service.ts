import { Injectable, signal } from '@angular/core';

type ThemePreference = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'todo.theme';

/**
 * Gestiona el tema claro/oscuro usando el theming de Ionic.
 *
 * Activa la paleta oscura de Ionic con la clase `.ion-palette-dark` en `<html>`
 * (import `dark.class.css`). Por defecto sigue al sistema operativo; el usuario
 * puede forzar claro/oscuro y la preferencia se guarda en localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly _dark = signal(false);

  /** `true` si actualmente se muestra el tema oscuro. */
  readonly dark = this._dark.asReadonly();

  /** Inicializa el tema al arrancar (preferencia guardada o sistema). */
  init(): void {
    this.apply(this.readPreference());
    // Si está en modo "system", reacciona a los cambios del SO.
    this.media.addEventListener('change', () => {
      if (this.readPreference() === 'system') {
        this.apply('system');
      }
    });
  }

  /** Alterna manualmente entre claro y oscuro (y guarda la preferencia). */
  toggle(): void {
    const next: ThemePreference = this._dark() ? 'light' : 'dark';
    this.write(next);
    this.apply(next);
  }

  private apply(pref: ThemePreference): void {
    const dark = pref === 'dark' || (pref === 'system' && this.media.matches);
    document.documentElement.classList.toggle('ion-palette-dark', dark);
    this._dark.set(dark);
  }

  private readPreference(): ThemePreference {
    try {
      return (localStorage.getItem(STORAGE_KEY) as ThemePreference) ?? 'system';
    } catch {
      return 'system';
    }
  }

  private write(pref: ThemePreference): void {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }
}
