export type CreateRequest<Entity extends { id: string }> = Omit<Entity, 'id'>;

export interface RequestQuery {
  cursor: string;
  limit: number;
}

export interface Response<T> {
  list: T[];
  total: number;
}