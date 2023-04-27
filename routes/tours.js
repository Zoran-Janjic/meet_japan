const express = require("express");
const AliasedToursRoutes = require("../middleware/AliasToursMiddleware/AliasedToursRoutes");

const tourRouter = express.Router();
const tourController = require("../controllers/toursControllers");

// ?  Aggregated routes stats
tourRouter.route("/all-tours-stats").get(tourController.getAllToursStats);

// ? Aliased tour routes
tourRouter
  .route("/lowest-5-price")
  .get(
    AliasedToursRoutes.topFiveLowestPriceBestReviewTours,
    tourController.getTours
  );

tourRouter
  .route("/top-5-rated")
  .get(AliasedToursRoutes.topFiveRated, tourController.getTours);

tourRouter
  .route("/top-5-newest")
  .get(AliasedToursRoutes.topFiveNewest, tourController.getTours);

tourRouter
  .route("/top-5-price")
  .get(AliasedToursRoutes.topFiveHighestPrice, tourController.getTours);

// ? Aggregated routes
tourRouter.route("/global-stats").get(tourController.getAllToursStats);

tourRouter.route("/monthly-stats/:year").get(tourController.getMonthlyStats);

// ? Regular routes

tourRouter.route("/").get(tourController.getTours).post(tourController.addTour);

tourRouter
  .route("/:tourId")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
