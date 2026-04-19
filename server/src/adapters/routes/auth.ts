import type { RouterModule } from './types';

export const authRoutes: RouterModule = {
  basePath: '/auth',
  moduleName: 'auth',
  routes: [],
};import type { RouterModule } from './types';

export const authRoutes: RouterModule = {
  basePath: '/auth',
  moduleName: 'auth',
  routes: [
    {
      handler: () => ({ status: 'pending-implementation' }),
      method: 'POST',
      path: '/login',
    },
  ],
};
