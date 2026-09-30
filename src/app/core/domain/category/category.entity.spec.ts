import { Category } from './category.entity';
import { CategoryId } from './category-id';
import { CategoryName } from './category-name.vo';
import { CategoryColor } from './category-color.vo';

const newCategory = () =>
  Category.create({
    id: CategoryId.of('c1'),
    name: CategoryName.of('Trabajo'),
    color: CategoryColor.of('#3880ff'),
    createdAt: 500,
  });

describe('Category (entidad)', () => {
  it('create() guarda los datos', () => {
    const category = newCategory();
    expect(category.id as string).toBe('c1');
    expect(category.name as string).toBe('Trabajo');
    expect(category.color as string).toBe('#3880ff');
    expect(category.createdAt).toBe(500);
  });

  it('rename() cambia el nombre devolviendo nueva instancia (inmutable)', () => {
    const category = newCategory();
    const renamed = category.rename(CategoryName.of('Personal'));
    expect(renamed).not.toBe(category);
    expect(renamed.name as string).toBe('Personal');
    expect(category.name as string).toBe('Trabajo');
  });

  it('recolor() cambia el color sin mutar la original', () => {
    const category = newCategory();
    const recolored = category.recolor(CategoryColor.of('#2dd36f'));
    expect(recolored.color as string).toBe('#2dd36f');
    expect(category.color as string).toBe('#3880ff');
  });

  it('fromProps() + snapshot() hacen round-trip', () => {
    const props = newCategory().snapshot();
    expect(Category.fromProps(props).snapshot()).toEqual(props);
  });
});
