import { CategoryColor } from './category-color.vo';
import { CategoryId } from './category-id';
import { CategoryName } from './category-name.vo';


export interface CategoryProps {
  readonly id: CategoryId;
  readonly name: CategoryName;
  readonly color: CategoryColor;
  readonly createdAt: number;
}

export class Category {
  private constructor(private readonly props: CategoryProps) {}

  static create(input: {
    id: CategoryId;
    name: CategoryName;
    color: CategoryColor;
    createdAt: number;
  }): Category {
    return new Category({ ...input });
  }

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

  rename(name: CategoryName): Category {
    return new Category({ ...this.props, name });
  }

  recolor(color: CategoryColor): Category {
    return new Category({ ...this.props, color });
  }

  snapshot(): CategoryProps {
    return this.props;
  }
}
