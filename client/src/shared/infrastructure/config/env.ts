export const getEnvConfig = () => {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
    nodeEnv: process.env.NODE_ENV ?? 'development',
  };
};
