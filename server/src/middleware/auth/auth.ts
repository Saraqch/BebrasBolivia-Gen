export interface AuthContext {
  requestId: string;
  userId?: string;
}

export const authMiddleware = (context: AuthContext): AuthContext => {
  return context;
};