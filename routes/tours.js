const express = require("express");
const AliasedToursRoutes = require("../middleware/AliasToursMiddleware/AliasedToursRoutes");

const tourRouter = express.Router();
const tourController = require("../controllers/toursControllers");

tourRouter.route("/").get(tourController.getTours).post(tourController.addTour);

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

// ? Regular routes
tourRouter
  .route("/:tourId")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
