const express = require("express");
const reviewRouter = express.Router();
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
