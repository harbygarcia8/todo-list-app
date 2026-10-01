import { CategoryId } from '../category/category-id';
import { TaskId } from './task-id';
import { TaskTitle } from './task-title.vo';

export interface TaskProps {
  readonly id: TaskId;
  readonly title: TaskTitle;
  readonly completed: boolean;
  readonly categoryId: CategoryId | null;
  readonly createdAt: number;
}

export class Task {
  private constructor(private readonly props: TaskProps) {}

  static create(input: {
    id: TaskId;
    title: TaskTitle;
    categoryId?: CategoryId | null;
    createdAt: number;
  }): Task {
    return new Task({
      id: input.id,
      title: input.title,
      completed: false,
      categoryId: input.categoryId ?? null,
      createdAt: input.createdAt,
    });
  }

  static fromProps(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): TaskId {
    return this.props.id;
  }
  get title(): TaskTitle {
    return this.props.title;
  }
  get completed(): boolean {
    return this.props.completed;
  }
  get categoryId(): CategoryId | null {
    return this.props.categoryId;
  }
  get createdAt(): number {
    return this.props.createdAt;
  }

  toggle(): Task {
    return new Task({ ...this.props, completed: !this.props.completed });
  }

  rename(title: TaskTitle): Task {
    return new Task({ ...this.props, title });
  }

  assignCategory(categoryId: CategoryId | null): Task {
    return new Task({ ...this.props, categoryId });
  }

  snapshot(): TaskProps {
    return this.props;
  }
}
