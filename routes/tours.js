// Import necessary modules and files
const express = require("express");
const applicationMiddleware = require("../middleware/index");
const tourRouter = express.Router();
const tourController = require("../controllers/toursControllers");
const reviewRouter = require("./reviews");

// ?  Aggregated routes stats
tourRouter.route("/all-tours-stats").get(tourController.getAllToursStats);

// ? Aliased tour routes
tourRouter.route("/lowest-5-price").get(
  // ? Apply middleware for fetching the top five tours with the lowest price
  applicationMiddleware.AliasedRoutes.topFiveHighestPrice,
  tourController.getTours
);

tourRouter.route("/top-5-rated").get(
  // ? Apply middleware for fetching the top five highest-rated tours
  applicationMiddleware.AliasedRoutes.topFiveHighestPrice,
  tourController.getTours
);

tourRouter.route("/top-5-newest").get(
  // ? Apply middleware for fetching the top five newest tours
  applicationMiddleware.AliasedRoutes.topFiveNewest,
  tourController.getTours
);

tourRouter.route("/top-5-price").get(
  // ? Apply middleware for fetching the top five tours with the highest price
  applicationMiddleware.AliasedRoutes.topFiveHighestPrice,
  tourController.getTours
);

// ? Aggregated routes
tourRouter.route("/global-stats").get(tourController.getAllToursStats); // ? Get global statistics for all tours

tourRouter.route("/monthly-stats/:year").get(tourController.getMonthlyStats); // ? Get monthly statistics for tours in a specific year

// ? Regular routes

tourRouter
  .route("/")
  .get(tourController.getTours) // ? Get all tours
  .post(
    applicationMiddleware.RouteProtect.protectedRoute, // ? Apply middleware for route protection
    applicationMiddleware.RoleRestrictedRoute.restrictTo("admin", "tourguide"), // ? Apply middleware for restricting access based on user roles
    tourController.addTour // ? Add a new tour
  );

tourRouter
  .route("/:id")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute, // ? Apply middleware for route protection
    tourController.getTour // ? Get a specific tour by ID
  )
  .patch(
    applicationMiddleware.RouteProtect.protectedRoute, // ? Apply middleware for route protection
    applicationMiddleware.RoleRestrictedRoute.restrictTo("admin", "tourguide"), // ? Apply middleware for restricting access based on user roles
    tourController.updateTour // ? Update a specific tour by ID
  )
  .delete(
    applicationMiddleware.RouteProtect.protectedRoute, // ? Apply middleware for route protection
    applicationMiddleware.RoleRestrictedRoute.restrictTo("admin", "tourguide"), // ? Apply middleware for restricting access based on user roles
    tourController.deleteTour // ? Delete a specific tour by ID
  );

// ? Nested routes
// ? Use the review router for the specific route
tourRouter.use("/:tourId/reviews", reviewRouter);

module.exports = tourRouter;
