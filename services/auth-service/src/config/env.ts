const toPort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value ?? fallback);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toPort(process.env.PORT, 4101),
  serviceName: 'auth-service',
} as const;
