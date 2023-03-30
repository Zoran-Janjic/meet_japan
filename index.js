const express = require("express");

const app = express();
const cors = require("cors");
const Logger = require("./middleware/AppLogger");

//! Remove later all below
const fs = require("fs");

// ! MOCK DATA IMPORTS REMOVED BEFORE PRODUCTION START
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/mock/dev-data/data/tours-simple.json`)
);
//  * Middleware

app.use(express.json());
app.use(cors());
app.use(Logger.requestLogger);

//  * Routes mapping

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 200,
    data: {
      tours,
    },
  });
};

const addNewTour = (req, res) => {
  res.status(200).json({
    status: 200,
    data: {
      tour: "created",
    },
  });
};

const getSingleTour = (req, res) => {
  const { tourId } = req.params;

  const foundTour = tours.find((tour) => tour.id === Number(tourId));

  res.status(200).json({
    status: 200,
    data: {
      tour: foundTour,
    },
  });
};

const updateSingleTour = (req, res) => {
  const { tourId } = req.params;

  // ? UPDATE TOUR
  res.status(200).json({
    status: 200,
    data: {
      tour: { results: `tour updated successfully with ${tourId}` },
    },
  });
};

const deleteSingleTour = (req, res) => {
  const { tourId } = req.params;

  res.status(200).json({
    status: 200,
    data: {
      tour: { results: `tour deleted successfully with ${tourId}` },
    },
  });
};

app.route("/api/v1/tours").get(getAllTours).post(addNewTour);
app
  .route("/api/v1/tours/:tourId")
  .get(getSingleTour)
  .patch(updateSingleTour)
  .delete(deleteSingleTour);

// * Unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "No such endpoint." });
};
app.use(unknownEndpoint);
module.exports = app;
