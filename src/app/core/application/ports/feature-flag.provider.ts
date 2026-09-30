/** Claves de los feature flags gestionados remotamente. */
export const FeatureFlag = {
  CategoriesEnabled: 'categories_enabled',
} as const;

export type FeatureFlagKey = (typeof FeatureFlag)[keyof typeof FeatureFlag];

export interface FeatureFlagProvider {
  /** Inicializa el proveedor y descarga los valores remotos (con fallback). */
  initialize(): Promise<void>;

  /** Vuelve a descargar los valores (para reflejar cambios sin reiniciar). */
  refresh(): Promise<void>;

  /** Indica si un flag está activo. */
  isEnabled(flag: FeatureFlagKey): boolean;
}
