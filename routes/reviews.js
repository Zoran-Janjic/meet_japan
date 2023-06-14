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
  .route("/")
  .get(reviewsController.getSingleTourReview) // * Merged params from the /:tourId/reviews
  .post(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
    applicationMiddleware.ReviewsMiddleware.setTourAndUserIdForReview,
    reviewsController.createReview
  );

reviewRouter
  .route("/allReviews")
  .get(reviewsController.getAllReviews)
  .post(
    applicationMiddleware.RouteProtect.protectedRoute,
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
    reviewsController.createReview
  );

reviewRouter
  .route("/:id")
  .get(reviewsController.getSingleReview)
  .delete(reviewsController.deleteReview)
  .patch(reviewsController.updateReview);

module.exports = reviewRouter;
