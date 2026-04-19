import { createUserController, type CreateUserInput } from '../controllers/user/create';
import { getAllUsersController } from '../controllers/user/getAll';
import { updateUserController, type UpdateUserInput } from '../controllers/user/update';
import { createContainer } from '../../config/container';

import type { RouterModule } from './types';

const container = createContainer();

export const userRoutes: RouterModule = {
  basePath: '/user',
  moduleName: 'user',
  routes: [
    {
      handler: (payload: unknown) => createUserController(container.userRepository, payload as CreateUserInput),
      method: 'POST',
      path: '/create',
    },
    {
      handler: () => getAllUsersController(container.userRepository),
      method: 'GET',
      path: '/getAll',
    },
    {
      handler: (payload: unknown) => updateUserController(container.userRepository, String((payload as { id?: string }).id ?? ''), payload as UpdateUserInput),
      method: 'PUT',
      path: '/update',
    },
  ],
};
