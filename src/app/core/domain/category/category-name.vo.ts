import { Branded } from '../shared/branded';
import { Result, ok, err } from '../shared/result';
import { CategoryNameError, EmptyCategoryNameError } from './category.errors';

/** Value Object: nombre de categoría válido (no vacío). */
export type CategoryName = Branded<string, 'CategoryName'>;

export const CategoryName = {
  /** Crea un nombre validado a partir del texto del usuario. */
  create(raw: string): Result<CategoryName, CategoryNameError> {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return err(new EmptyCategoryNameError());
    }
    return ok(trimmed as CategoryName);
  },

  /** Reconstruye un nombre ya validado (desde persistencia). */
  of(value: string): CategoryName {
    return value as CategoryName;
  },
};
