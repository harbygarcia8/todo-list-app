/**
 * Representación plana (serializable) de una tarea para persistencia.
 * Sin branded types ni value objects: solo primitivos que van a storage.
 */
export interface TaskDTO {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: number;
}
