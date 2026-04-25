export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email?: string;
  name?: string;
}

export interface UpdateUserPayload {
  email?: string;
  id?: string;
  name?: string;
}
