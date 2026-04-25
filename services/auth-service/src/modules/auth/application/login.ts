export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  user: {
    email: string;
    id: string;
    name: string;
  };
}

export const login = (payload: LoginPayload): LoginResponse => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error('email and password are required');
  }

  return {
    accessToken: `dev-token-${Date.now()}`,
    expiresIn: 3600,
    tokenType: 'Bearer',
    user: {
      email,
      id: 'dev-user',
      name: 'Developer User',
    },
  };
};
