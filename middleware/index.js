const RouteProtect = require("./ProtectedRoutesMiddleware/RouteProtect");
const RoleRestrictedRoute = require("./RestrictedRoutesMiddleware/RoleRestricted");
const AliasedRoutes = require("./AliasToursMiddleware/AliasedToursRoutes");
const ReviewsMiddleware = require("./ReviewMiddleware/Reviews");
const CurrentUserIdMiddleware = require("./CurrentUserDetails/CurrentUserDetails");
const CreateBookingMiddleware = require("./CreateBooking/CreateBooking");

module.exports = {
  RouteProtect,
  RoleRestrictedRoute,
  AliasedRoutes,
  ReviewsMiddleware,
  CurrentUserIdMiddleware,
  CreateBookingMiddleware,
};
