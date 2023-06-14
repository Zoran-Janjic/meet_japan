const RouteProtect = require("./ProtectedRoutesMiddleware/RouteProtect");
const RoleRestrictedRoute = require("./RestrictedRoutesMiddleware/RoleRestricted");
const AliasedRoutes = require("./AliasToursMiddleware/AliasedToursRoutes");
const ReviewsMiddleware = require("./ReviewMiddleware/Reviews");

module.exports = {
  RouteProtect,
  RoleRestrictedRoute,
  AliasedRoutes,
  ReviewsMiddleware,
};
