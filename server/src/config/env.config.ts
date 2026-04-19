export interface EnvConfig {
  nodeEnv: string;
  port: number;
  routePrefix: string;
}

const toNumber = (rawValue: string | undefined, fallback: number): number => {
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getEnvConfig = (): EnvConfig => {
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: toNumber(process.env.PORT, 3000),
    routePrefix: process.env.ROUTE_PREFIX ?? '/api/v1',
  };
};
