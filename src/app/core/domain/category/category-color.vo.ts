import { Branded } from '../shared/branded';
import { Result, ok, err } from '../shared/result';
import { CategoryColorError, InvalidCategoryColorError } from './category.errors';

/** Value Object: color hexadecimal válido (`#RRGGBB`). */
export type CategoryColor = Branded<string, 'CategoryColor'>;

const HEX = /^#[0-9a-fA-F]{6}$/;

export const CategoryColor = {
  /** Crea un color validado a partir de un string. */
  create(raw: string): Result<CategoryColor, CategoryColorError> {
    if (!HEX.test(raw)) {
      return err(new InvalidCategoryColorError(raw));
    }
    return ok(raw as CategoryColor);
  },

  /** Reconstruye un color ya validado (desde persistencia). */
  of(value: string): CategoryColor {
    return value as CategoryColor;
  },
};
