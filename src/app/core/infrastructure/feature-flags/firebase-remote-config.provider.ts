import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  RemoteConfig,
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
} from 'firebase/remote-config';
import {
  FeatureFlag,
  FeatureFlagKey,
  FeatureFlagProvider,
} from '../../application/ports/feature-flag.provider';
import { environment } from '../../../../environments/environment';

/**
 * Adaptador de {@link FeatureFlagProvider} con Firebase Remote Config.
 *
 * Es *fault-tolerant*: si Firebase no está configurado (sin `apiKey`) o la
 * descarga falla, la app sigue funcionando con los valores por defecto de
 * {@link environment.featureFlagDefaults}.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseRemoteConfigProvider implements FeatureFlagProvider {
  private app?: FirebaseApp;
  private remoteConfig?: RemoteConfig;

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
      this.app = initializeApp(environment.firebase);
      this.remoteConfig = getRemoteConfig(this.app);
      this.remoteConfig.settings.minimumFetchIntervalMillis =
        environment.remoteConfigMinimumFetchIntervalMillis;
      this.remoteConfig.defaultConfig = { ...environment.featureFlagDefaults };

      await fetchAndActivate(this.remoteConfig);
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
    if (!this.remoteConfig) {
      return;
    }
    try {
      await fetchAndActivate(this.remoteConfig);
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
    if (!this.remoteConfig) {
      return;
    }
    this.values.set(
      FeatureFlag.CategoriesEnabled,
      getBoolean(this.remoteConfig, FeatureFlag.CategoriesEnabled),
    );
  }
}
