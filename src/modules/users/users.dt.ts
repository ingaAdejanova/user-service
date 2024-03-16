export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type UserPayload = {
  name: string;
  email: string;
};

export type UserParams = {
  userId: string;
};

export type PaginationResult<T> = {
  data: T[];
  next_cursor: string | null;
};
