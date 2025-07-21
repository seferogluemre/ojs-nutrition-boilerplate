import Elysia from 'elysia';

import { authenticationController, rolesController } from './auth';
import { cartController } from './cart';
import { categoriesController } from './categories';
import { authController as customerAuthController } from './customer';
import { customerAddressesController } from './customer/customer-addresses';
import { fileLibraryAssetsController } from './file-library-assets';
import { locationsController } from './locations';
import { ordersController } from './orders';
import { postsController } from './posts';
import productsController from './products';
import { productVariantController } from './products/product-variants';
import { systemAdministrationController } from './system-administration';
import { usersController } from './users';
import { userAddressesController } from './users/user-addresses';

const app = new Elysia()
  .use(systemAdministrationController)
  .use(usersController)
  .use(authenticationController)
  .use(rolesController)
  .use(postsController)
  .use(locationsController)
  .use(fileLibraryAssetsController)
  .use(customerAuthController)
  .use(customerAddressesController)
  .use(userAddressesController)
  .use(cartController)
  .use(ordersController)
  .use(productsController)
  .use(categoriesController)
  .use(productVariantController)
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
  { name: 'CustomerAddress', description: 'Customer Address management endpoints' },
  { name: 'UserAddress', description: 'User Address endpoints' },
  { name: 'Product', description: 'Product management endpoints' },
  { name: 'Category', description: 'Category management endpoints' },
  { name: 'Cart', description: 'Shopping cart endpoints' },
  { name: 'Orders', description: 'Order management endpoints' },
  { name: 'Product Variants', description: 'Product variant management endpoints' },
];

export default app;