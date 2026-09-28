import { CategoryColor } from './category-color.vo';
import { CategoryId } from './category-id';
import { CategoryName } from './category-name.vo';

/** Estado interno inmutable de una categoría. */
export interface CategoryProps {
  readonly id: CategoryId;
  readonly name: CategoryName;
  readonly color: CategoryColor;
  readonly createdAt: number;
}

/**
 * Entidad Category: nombre + color con los que se agrupan y filtran las tareas.
 * Inmutable: `rename`/`recolor` devuelven una nueva instancia.
 */
export class Category {
  private constructor(private readonly props: CategoryProps) {}

  /** Crea una categoría nueva. */
  static create(input: {
    id: CategoryId;
    name: CategoryName;
    color: CategoryColor;
    createdAt: number;
  }): Category {
    return new Category({ ...input });
  }

  /** Reconstruye una categoría desde sus props (desde persistencia). */
  static fromProps(props: CategoryProps): Category {
    return new Category(props);
  }

  get id(): CategoryId {
    return this.props.id;
  }
  get name(): CategoryName {
    return this.props.name;
  }
  get color(): CategoryColor {
    return this.props.color;
  }
  get createdAt(): number {
    return this.props.createdAt;
  }

  /** Cambia el nombre por otro ya validado. */
  rename(name: CategoryName): Category {
    return new Category({ ...this.props, name });
  }

  /** Cambia el color por otro ya validado. */
  recolor(color: CategoryColor): Category {
    return new Category({ ...this.props, color });
  }

  /** Expone las props (para el mapeo en infraestructura). */
  snapshot(): CategoryProps {
    return this.props;
  }
}
