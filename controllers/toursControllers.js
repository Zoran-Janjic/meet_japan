const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");

// * Param middleware

/*
 * Check if the new tour containes the required data to create a new tour
 */

const checkRequestBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      message: "Missing required parameters",
    });
  }
  return next();
};

// * End of param middleware

// * Route handlers
const getTours = (req, res) => {
  const allTour = res.status(200).json({
    status: StatusCodes.OK,
    data: { tours },
  });
};

const addTour = (req, res) => {
  res.status(200).json({
    status: 200,
    data: {
      tour: "created",
    },
  });
};

const getTour = (req, res) => {
  const { tourId } = req.params;

  const foundTour = tours.find((tour) => tour.id === Number(tourId));

  res.status(200).json({
    status: 200,
    data: {
      tour: foundTour,
    },
  });
};

const updateTour = (req, res) => {
  const { tourId } = req.params;

  // ? UPDATE TOUR
  res.status(200).json({
    status: 200,
    data: {
      tour: { results: `tour updated successfully with ${tourId}` },
    },
  });
};

const deleteTour = (req, res) => {
  const { tourId } = req.params;

  res.status(200).json({
    status: 200,
    data: {
      tour: { results: `tour deleted successfully with ${tourId}` },
    },
  });
};

module.exports = {
  getTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  checkRequestBody,
};
