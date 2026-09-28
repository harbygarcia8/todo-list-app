import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

import { routes } from './app.routes';
import { coreProviders } from './core/infrastructure/di/core.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular({}),

    // Almacenamiento local (IndexedDB con respaldo en localStorage).
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__todo_db',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
      }),
    ),

    // Núcleo hexagonal: puertos → adaptadores + casos de uso.
    ...coreProviders,
  ],
};
