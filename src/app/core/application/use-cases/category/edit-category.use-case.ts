import { CategoryColor } from '../../../domain/category/category-color.vo';
import { CategoryId } from '../../../domain/category/category-id';
import { CategoryName } from '../../../domain/category/category-name.vo';
import { Result, ok } from '../../../domain/shared/result';
import { CategoryRepository } from '../../ports/category-repository.port';
import { CreateCategoryError } from './create-category.use-case';

export interface EditCategoryInput {
  name?: string;
  color?: string;
}

export class EditCategoryUseCase {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(
    id: CategoryId,
    input: EditCategoryInput,
  ): Promise<Result<void, CreateCategoryError>> {
    const category = await this.categories.findById(id);
    if (!category) {
      return ok(undefined); // no-op si no existe
    }

    let updated = category;

    if (input.name !== undefined) {
      const name = CategoryName.create(input.name);
      if (!name.ok) {
        return name;
      }
      updated = updated.rename(name.value);
    }

    if (input.color !== undefined) {
      const color = CategoryColor.create(input.color);
      if (!color.ok) {
        return color;
      }
      updated = updated.recolor(color.value);
    }

    await this.categories.save(updated);
    return ok(undefined);
  }
}
