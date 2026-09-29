import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

import { routes } from './app.routes';
import { coreProviders } from './core/infrastructure/di/core.providers';
import { FEATURE_FLAG_PROVIDER } from './core/infrastructure/di/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Forzamos el modo Material en todas las plataformas: header consistente
    // (título alineado a la izquierda en iOS y Android) y sin solapes del
    // título centrado con los botones de acción. Look unificado de marca.
    provideIonicAngular({ mode: 'md' }),

    // Almacenamiento local (IndexedDB con respaldo en localStorage).
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__todo_db',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
      }),
    ),

    // Núcleo hexagonal: puertos → adaptadores + casos de uso.
    ...coreProviders,

    // Descarga los feature flags (Remote Config) antes de renderizar.
    provideAppInitializer(() => inject(FEATURE_FLAG_PROVIDER).initialize()),
  ],
};
