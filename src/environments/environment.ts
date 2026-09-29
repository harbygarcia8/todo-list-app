/**
 * Configuración de entorno.
 *
 * `firebase` contiene las credenciales WEB del proyecto (son públicas / de
 * cliente, es seguro versionarlas). Se reutiliza el proyecto `todo-categorias`.
 * Si `apiKey` queda vacío, la app funciona en modo *offline* con los valores
 * por defecto de los feature flags.
 */
export const environment = {
  production: false,

  firebase: {
    apiKey: 'AIzaSyB4c3erzZE19ATGLlml9QDzHsy_8OmUUac',
    authDomain: 'todo-categorias.firebaseapp.com',
    projectId: 'todo-categorias',
    storageBucket: 'todo-categorias.firebasestorage.app',
    messagingSenderId: '311593447199',
    appId: '1:311593447199:web:8828d4f27b01eb5b450a2a',
  },

  /** Intervalo mínimo (ms) entre descargas de Remote Config (0 en dev para ver cambios al instante). */
  remoteConfigMinimumFetchIntervalMillis: 0,

  /** Valores por defecto de los feature flags (fallback si Remote Config no responde). */
  featureFlagDefaults: {
    categories_enabled: true,
  },
};
