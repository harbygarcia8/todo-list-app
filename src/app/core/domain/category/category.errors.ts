/** El nombre de la categoría llegó vacío. */
export class EmptyCategoryNameError {
  readonly kind = 'EmptyCategoryName' as const;
  readonly message = 'El nombre de la categoría no puede estar vacío.';
}

/** El color no cumple el formato hexadecimal `#RRGGBB`. */
export class InvalidCategoryColorError {
  readonly kind = 'InvalidCategoryColor' as const;
  constructor(readonly value: string) {}
  get message(): string {
    return `"${this.value}" no es un color hexadecimal válido (formato #RRGGBB).`;
  }
}

export type CategoryNameError = EmptyCategoryNameError;
export type CategoryColorError = InvalidCategoryColorError;
