import { Task } from '../../domain/task/task.entity';
import { TaskId } from '../../domain/task/task-id';

export interface TaskRepository {
  findAll(): Promise<readonly Task[]>;
  findById(id: TaskId): Promise<Task | null>;
  save(task: Task): Promise<void>;
  delete(id: TaskId): Promise<void>;
}
