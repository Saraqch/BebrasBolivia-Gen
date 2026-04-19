import type { RouterModule } from './types';

export const teamRoutes: RouterModule = {
  basePath: '/team',
  moduleName: 'team',
  routes: [],
};
import type { RouterModule } from './types';

export const teamRoutes: RouterModule = {
  basePath: '/teams',
  moduleName: 'team',
  routes: [
    {
      handler: () => ({ status: 'pending-implementation' }),
      method: 'GET',
      path: '/',
    },
  ],
};
