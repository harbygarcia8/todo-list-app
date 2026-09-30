import { Branded } from '../shared/branded';
import { Result, ok, err } from '../shared/result';
import { CategoryNameError, EmptyCategoryNameError } from './category.errors';

export type CategoryName = Branded<string, 'CategoryName'>;

export const CategoryName = {
  create(raw: string): Result<CategoryName, CategoryNameError> {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return err(new EmptyCategoryNameError());
    }
    return ok(trimmed as CategoryName);
  },

  of(value: string): CategoryName {
    return value as CategoryName;
  },
};
