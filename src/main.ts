import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkDoneOutline,
  checkmarkOutline,
  createOutline,
  flagOutline,
  moonOutline,
  pricetagOutline,
  pricetagsOutline,
  sunnyOutline,
  trashOutline,
} from 'ionicons/icons';

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { TasksFacade } from './app/features/tasks/tasks.facade';

// Registro de iconos usados en la app (build standalone de Ionic).
addIcons({
  'add-outline': addOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'pricetag-outline': pricetagOutline,
  'pricetags-outline': pricetagsOutline,
  'checkmark-outline': checkmarkOutline,
  'checkmark-done-outline': checkmarkDoneOutline,
  'flag-outline': flagOutline,
  'moon-outline': moonOutline,
  'sunny-outline': sunnyOutline,
});

bootstrapApplication(App, appConfig)
  .then((appRef) => {
    // Hook de pruebas E2E, solo en desarrollo: permite a Puppeteer/Playwright
    // sembrar datos deterministas a través del facade, sin depender de la UI.
    if (isDevMode()) {
      (globalThis as Record<string, unknown>)['__todo'] = {
        facade: appRef.injector.get(TasksFacade),
        tick: () => appRef.tick(),
      };
    }
  })
  .catch((err) => console.error(err));
