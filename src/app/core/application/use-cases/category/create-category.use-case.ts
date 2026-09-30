import { CategoryColor } from '../../../domain/category/category-color.vo';
import { CategoryId } from '../../../domain/category/category-id';
import { CategoryName } from '../../../domain/category/category-name.vo';
import {
  CategoryColorError,
  CategoryNameError,
} from '../../../domain/category/category.errors';
import { Category } from '../../../domain/category/category.entity';
import { Result, ok } from '../../../domain/shared/result';
import { Clock } from '../../ports/clock.port';
import { IdGenerator } from '../../ports/id-generator.port';
import { CategoryRepository } from '../../ports/category-repository.port';

export type CreateCategoryError = CategoryNameError | CategoryColorError;

export interface CreateCategoryInput {
  name: string;
  color: string;
}

export class CreateCategoryUseCase {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(input: CreateCategoryInput): Promise<Result<Category, CreateCategoryError>> {
    const name = CategoryName.create(input.name);
    if (!name.ok) {
      return name;
    }
    const color = CategoryColor.create(input.color);
    if (!color.ok) {
      return color;
    }
    const category = Category.create({
      id: CategoryId.of(this.ids.generate()),
      name: name.value,
      color: color.value,
      createdAt: this.clock.now(),
    });
    await this.categories.save(category);
    return ok(category);
  }
}
