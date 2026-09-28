import { Task } from '../../domain/task/task.entity';
import { TaskId } from '../../domain/task/task-id';

/**
 * Puerto de persistencia de tareas (driven port).
 *
 * El núcleo declara QUÉ necesita; la infraestructura decide CÓMO (IndexedDB,
 * localStorage, API…). Los casos de uso dependen de esta interfaz, nunca de
 * una implementación concreta.
 */
export interface TaskRepository {
  /** Devuelve todas las tareas. */
  findAll(): Promise<readonly Task[]>;

  /** Busca una tarea por id (o `null` si no existe). */
  findById(id: TaskId): Promise<Task | null>;

  /** Inserta o actualiza una tarea (upsert). */
  save(task: Task): Promise<void>;

  /** Elimina una tarea por id. */
  delete(id: TaskId): Promise<void>;
}
