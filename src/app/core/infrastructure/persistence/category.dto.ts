/** Representación plana (serializable) de una categoría para persistencia. */
export interface CategoryDTO {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}
