import stackMiddlewares from '@esp/libs/next-middleware/stack-middleware';
import withAuthorization from '@esp/libs/next-middleware/with-authorization';
import withPermissions from '@esp/libs/next-middleware/with-permissions';
import withProxyApi from '@esp/libs/next-middleware/with-proxy-api';
import withRefreshToken from '@esp/libs/next-middleware/with-refresh-token';

export default stackMiddlewares([
  withProxyApi,
  withAuthorization,
  withRefreshToken,
  withPermissions,
]);

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|images|icons|favicon.ico|style-guide).*)'],
  unstable_allowDynamic: [
    '**/node_modules/lodash/_root.js', // use a glob to allow anything in the function-bind 3rd party module
  ],
};
