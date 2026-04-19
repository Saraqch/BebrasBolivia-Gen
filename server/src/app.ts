import { registerRoutes, routeModules } from './adapters/routes/routes';
import { getAppConfig } from './config/app.config';

export interface AppSnapshot {
  appName: string;
  modules: string[];
  routes: ReturnType<typeof registerRoutes>;
}

export const createAppSnapshot = (): AppSnapshot => {
  const config = getAppConfig();
  const routes = registerRoutes(config.routePrefix);

  return {
    appName: config.appName,
    modules: routeModules.map((routeModule) => routeModule.moduleName),
    routes,
  };
};
