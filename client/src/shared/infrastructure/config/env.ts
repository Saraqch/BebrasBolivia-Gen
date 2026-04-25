export const getEnvConfig = () => {
  return {
    // Legacy gateway URL kept for backward compatibility.
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
    authServiceUrl:
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:4101',
    userServiceUrl:
      process.env.NEXT_PUBLIC_USER_SERVICE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:4102',
    teamServiceUrl:
      process.env.NEXT_PUBLIC_TEAM_SERVICE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:4103',
    nodeEnv: process.env.NODE_ENV ?? 'development',
  };
};
