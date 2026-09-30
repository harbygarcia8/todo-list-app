import { Branded } from '../shared/branded';
import { Result, ok, err } from '../shared/result';
import { CategoryColorError, InvalidCategoryColorError } from './category.errors';


export type CategoryColor = Branded<string, 'CategoryColor'>;

const HEX = /^#[0-9a-fA-F]{6}$/;

export const CategoryColor = {

  create(raw: string): Result<CategoryColor, CategoryColorError> {
    if (!HEX.test(raw)) {
      return err(new InvalidCategoryColorError(raw));
    }
    return ok(raw as CategoryColor);
  },

  of(value: string): CategoryColor {
    return value as CategoryColor;
  },
};
