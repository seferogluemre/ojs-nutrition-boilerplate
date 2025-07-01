import Elysia from 'elysia';

import { authenticationController, rolesController } from './auth';
import { authController as customerAuthController } from './customer';
import { fileLibraryAssetsController } from './file-library-assets';
import { locationsController } from './locations';
import { postsController } from './posts';
import { systemAdministrationController } from './system-administration';
import { userAddressesController } from './user-addresses';
import { usersController } from './users';

const app = new Elysia()
  .use(systemAdministrationController)
  .use(usersController)
  .use(authenticationController)
  .use(rolesController)
  .use(postsController)
  .use(locationsController)
  .use(fileLibraryAssetsController)
  .use(customerAuthController)
  .use(userAddressesController)
  .get(
    '/',
    () => ({
      message: 'Hello Elysia',
    }),
    {
      detail: {
        summary: 'Hello World',
      },
    },
  );

export const swaggerTags: { name: string; description: string }[] = [
  {
    name: 'System Administration',
    description: 'System Administration endpoints',
  },
  { name: 'Audit Logs', description: 'Audit Logs endpoints' },
  { name: 'User', description: 'User endpoints' },
  { name: 'Auth', description: 'Auth endpoints' },
  { name: 'Role', description: 'Role endpoints' },
  { name: 'Post', description: 'Post endpoints' },
  { name: 'Country', description: 'Country endpoints' },
  { name: 'State', description: 'State endpoints' },
  { name: 'City', description: 'City endpoints' },
  { name: 'Region', description: 'Region endpoints' },
  { name: 'Subregion', description: 'Subregion endpoints' },
  { name: 'File Library Assets', description: 'File Library Assets endpoints' },
  { name: 'Customer Auth', description: 'Customer Authentication endpoints' },
  { name: 'UserAddress', description: 'User Address endpoints' },
];

export default app;
