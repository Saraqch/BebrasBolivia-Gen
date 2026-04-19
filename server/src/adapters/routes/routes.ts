import { authRoutes } from './auth';
import { teamRoutes } from './team';
import type { RegisteredRoute, RouterModule } from './types';
import { userRoutes } from './user';

export const routeModules: RouterModule[] = [authRoutes, teamRoutes, userRoutes];

const normalizePath = (path: string): string => {
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
};

export const registerRoutes = (
  routePrefix: string,
  modules: RouterModule[] = routeModules,
): RegisteredRoute[] => {
  const seen = new Set<string>();
  const registered: RegisteredRoute[] = [];

  for (const moduleConfig of modules) {
    for (const route of moduleConfig.routes) {
      const fullPath = normalizePath(`${routePrefix}${moduleConfig.basePath}${route.path}`);
      const key = `${route.method}:${fullPath}`;

      if (seen.has(key)) {
        throw new Error(`Duplicated endpoint detected: ${key}`);
      }

      seen.add(key);
      registered.push({
        fullPath,
        method: route.method,
        moduleName: moduleConfig.moduleName,
      });
    }
  }

  return registered;
};
