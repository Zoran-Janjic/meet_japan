const express = require("express");
// ? Allow access to the params from other routes
const reviewRouter = express.Router({ mergeParams: true });

const reviewsController = require("../controllers/reviewsController");
const applicationMiddleware = require("../middleware/index");
/*
Add later a review that can be posted for a tourguide by an user
check the nested routes with express
*/

reviewRouter
  .route("/allReviews")
  .get(reviewsController.getAllReviews)
  .post(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
    reviewsController.createReview
  );

reviewRouter
  .route("/")
  .get(reviewsController.getSingleTourReview)
  .post(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
    reviewsController.createReview
  );

module.exports = reviewRouter;
