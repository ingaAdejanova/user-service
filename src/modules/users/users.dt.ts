export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface UserPayload {
  name: string;
  email: string;
}

export interface UserParams {
  userId: string;
}

export interface PaginationResult<T> {
  data: T[];
  next_cursor: string | null;
}
