const RouteProtect = require("./ProtectedRoutesMiddleware/RouteProtect");
const RoleRestrictedRoute = require("./RestrictedRoutesMiddleware/RoleRestricted");
const AliasedRoutes = require("./AliasToursMiddleware/AliasedToursRoutes");

module.exports = { RouteProtect, RoleRestrictedRoute, AliasedRoutes };
