import { Injectable } from '@angular/core';
import type { RemoteConfig } from 'firebase/remote-config';
import {
  FeatureFlag,
  FeatureFlagKey,
  FeatureFlagProvider,
} from '../../application/ports/feature-flag.provider';
import { environment } from '../../../../environments/environment';

/**
 * Adaptador de {@link FeatureFlagProvider} con Firebase Remote Config.
 *
 * Optimización de carga inicial: el SDK de Firebase (~760 kB) se importa de
 * forma DIFERIDA con `import()` dinámico dentro de `initialize()`, de modo que
 * NO entra en el bundle inicial (queda en un chunk aparte que se descarga solo
 * cuando hace falta). El resto de la app arranca ligera.
 *
 * Es *fault-tolerant*: si Firebase no está configurado (sin `apiKey`) o la
 * descarga falla, se usan los valores por defecto de {@link environment}.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseRemoteConfigProvider implements FeatureFlagProvider {
  private remoteConfig?: RemoteConfig;
  private rc?: typeof import('firebase/remote-config');

  /** Caché local de los valores de los flags. */
  private readonly values = new Map<string, boolean>();

  /** `true` cuando Remote Config está activo; `false` en modo fallback. */
  private remoteActive = false;

  async initialize(): Promise<void> {
    // Valores por defecto (fallback).
    this.values.set(
      FeatureFlag.CategoriesEnabled,
      environment.featureFlagDefaults.categories_enabled,
    );

    if (!environment.firebase.apiKey) {
      return; // sin credenciales → modo offline
    }

    try {
      // Import diferido: estos módulos NO están en el bundle inicial.
      const { initializeApp } = await import('firebase/app');
      this.rc = await import('firebase/remote-config');

      const app = initializeApp(environment.firebase);
      this.remoteConfig = this.rc.getRemoteConfig(app);
      this.remoteConfig.settings.minimumFetchIntervalMillis =
        environment.remoteConfigMinimumFetchIntervalMillis;
      this.remoteConfig.defaultConfig = { ...environment.featureFlagDefaults };

      await this.rc.fetchAndActivate(this.remoteConfig);
      this.remoteActive = true;
      this.sync();
    } catch (error) {
      console.warn(
        '[FirebaseRemoteConfigProvider] Remote Config no disponible, usando valores por defecto.',
        error,
      );
    }
  }

  async refresh(): Promise<void> {
    if (!this.remoteConfig || !this.rc) {
      return;
    }
    try {
      await this.rc.fetchAndActivate(this.remoteConfig);
      this.sync();
    } catch (error) {
      console.warn('[FirebaseRemoteConfigProvider] No se pudo refrescar.', error);
    }
  }

  isEnabled(flag: FeatureFlagKey): boolean {
    return this.values.get(flag) ?? false;
  }

  /** ¿Está Remote Config realmente activo (no fallback)? */
  isRemoteActive(): boolean {
    return this.remoteActive;
  }

  private sync(): void {
    if (!this.remoteConfig || !this.rc) {
      return;
    }
    this.values.set(
      FeatureFlag.CategoriesEnabled,
      this.rc.getBoolean(this.remoteConfig, FeatureFlag.CategoriesEnabled),
    );
  }
}
