const express = require("express");
const applicationMiddleware = require("../middleware/index");
const tourRouter = express.Router();
const tourController = require("../controllers/toursControllers");

// ?  Aggregated routes stats
tourRouter.route("/all-tours-stats").get(tourController.getAllToursStats);

// ? Aliased tour routes
tourRouter
  .route("/lowest-5-price")
  .get(
    applicationMiddleware.AliasedRoutes.topFiveHighestPrice,
    tourController.getTours
  );

tourRouter
  .route("/top-5-rated")
  .get(
    applicationMiddleware.AliasedRoutes.topFiveHighestPrice,
    tourController.getTours
  );

tourRouter
  .route("/top-5-newest")
  .get(
    applicationMiddleware.AliasedRoutes.topFiveNewest,
    tourController.getTours
  );

tourRouter
  .route("/top-5-price")
  .get(
    applicationMiddleware.AliasedRoutes.topFiveHighestPrice,
    tourController.getTours
  );

// ? Aggregated routes
tourRouter.route("/global-stats").get(tourController.getAllToursStats);

tourRouter.route("/monthly-stats/:year").get(tourController.getMonthlyStats);

// ? Regular routes

tourRouter
  .route("/")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    tourController.getTours
  )
  .post(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("admin", "tourguide"),
    tourController.addTour
  );

tourRouter
  .route("/:tourId")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    tourController.getTour
  )
  .patch(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("admin", "tourguide"),
    tourController.updateTour
  )
  .delete(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("admin", "tourguide"),
    tourController.deleteTour
  );

module.exports = tourRouter;
