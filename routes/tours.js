const express = require("express");

const tourRouter = express.Router();
const tourController = require("../controllers/toursControllers");

tourRouter
  .route("/")
  .get(tourController.getTours)
  .post(tourController.checkRequestBody, tourController.addTour);

tourRouter
  .route("/:tourId")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
