const express = require("express");
// ? Allow access to the params from other routes
const reviewRouter = express.Router({ mergeParams: true });
const reviewsController = require("../controllers/reviewsController");
const applicationMiddleware = require("../middleware/index");

reviewRouter
  .route("/")
  .get(reviewsController.getAllReviews)
  .post(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
    reviewsController.createReview
  );

module.exports = reviewRouter;
