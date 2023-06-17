const express = require("express");
// ? Allow access to the params from other routes
const reviewRouter = express.Router({ mergeParams: true });

const reviewsController = require("../controllers/reviewsController");
const applicationMiddleware = require("../middleware/index");
/*
Add later a review that can be posted for a tourguide by an user
check the nested routes with express
*/

reviewRouter.use(applicationMiddleware.RouteProtect.protectedRoute);

reviewRouter
  .route("/")
  .get(reviewsController.getSingleTourReview) // * Merged params from the /:tourId/reviews
  .post(
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
    applicationMiddleware.ReviewsMiddleware.setTourAndUserIdForReview,
    reviewsController.createReview
  );

reviewRouter
  .route("/allReviews")
  .get(reviewsController.getAllReviews)
  .post(
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
    reviewsController.createReview
  );

reviewRouter
  .route("/:id")
  .get(reviewsController.getSingleReview)
  .delete(
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user", "admin"),
    reviewsController.deleteReview
  )
  .patch(
    applicationMiddleware.RoleRestrictedRoute.restrictTo("user", "admin"),
    reviewsController.updateReview
  );

module.exports = reviewRouter;
