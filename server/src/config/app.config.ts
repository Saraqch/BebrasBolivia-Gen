import { getEnvConfig } from './env.config';

export interface AppConfig {
  appName: string;
  nodeEnv: string;
  port: number;
  routePrefix: string;
}

export const getAppConfig = (): AppConfig => {
  const env = getEnvConfig();

  return {
    appName: 'bebras-bolivia-gen-api',
    nodeEnv: env.nodeEnv,
    port: env.port,
    routePrefix: env.routePrefix,
  };
};
