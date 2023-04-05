const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");

// * Param middleware

/*
 * Check if the new tour containes the required data to create a new tour
 */

// const checkRequestBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       status: "Failed",
//       message: "Missing required parameters",
//     });
//   }
//   return next();
// };

// * End of param middleware

// * Route handlers
const getTours = async (req, res) => {
  const allTours = await Tour.find({});

  res.json({
    status: StatusCodes.OK,
    data: allTours,
  });
};

const addTour = async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.json({
    status: StatusCodes.OK,
    message: "Created",
    data: newTour,
  });
};

const getTour = async (req, res) => {
  const foundTour = await Tour.findById(req.params.tourId);

  if (foundTour != null) {
    res.json({
      status: StatusCodes.OK,
      data: {
        tour: foundTour,
      },
    });
  } else {
    res.json({
      status: StatusCodes.NOT_FOUND,
      message: `No tour found for the id: ${req.params.tourId}`,
    });
  }
};

const updateTour = async (req, res) => {
  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.tourId,
    req.body,
    { new: true, runValidators: true }
  );

  if (updatedTour) {
    res.json({ status: StatusCodes.OK, data: updatedTour });
  } else {
    res.json({ status: StatusCodes.NOT_FOUND, message: "Failed" });
  }
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
};
