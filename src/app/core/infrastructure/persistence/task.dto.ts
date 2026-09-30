
export interface TaskDTO {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: number;
}
