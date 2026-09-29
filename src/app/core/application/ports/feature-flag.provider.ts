/** Claves de los feature flags gestionados remotamente. */
export const FeatureFlag = {
  CategoriesEnabled: 'categories_enabled',
} as const;

export type FeatureFlagKey = (typeof FeatureFlag)[keyof typeof FeatureFlag];

/**
 * Puerto de feature flags (driven port).
 *
 * El núcleo declara QUÉ necesita (consultar un flag); la infraestructura decide
 * CÓMO (Firebase Remote Config, un JSON local, etc.). Al ser una interfaz, el
 * dominio y la aplicación no conocen Firebase.
 */
export interface FeatureFlagProvider {
  /** Inicializa el proveedor y descarga los valores remotos (con fallback). */
  initialize(): Promise<void>;

  /** Vuelve a descargar los valores (para reflejar cambios sin reiniciar). */
  refresh(): Promise<void>;

  /** Indica si un flag está activo. */
  isEnabled(flag: FeatureFlagKey): boolean;
}
