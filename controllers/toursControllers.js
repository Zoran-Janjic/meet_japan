const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants");
const BadRequestError = require("../errors/index");
const createHttpResponse = require("../helpers/createHttpResponse");
const toursControllerHelper = require("../helpers/tours_controller_helper");

// * Route handlers
const getTours = ControllerHandlerFactory.getAllDocuments(
  Tour,
  DatabaseOperationsConstants.GET_ALL_DOCUMENTS
);

const addTour = ControllerHandlerFactory.createDocument(
  Tour,
  DatabaseOperationsConstants.CREATE_NEW_DOCUMENT
);

const getTour = ControllerHandlerFactory.getDocument(
  Tour,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID,
  { path: "tourReviews" }
);

const updateTour = ControllerHandlerFactory.updateDocument(
  Tour,
  DatabaseOperationsConstants.UPDATE_SINGLE_DOCUMENT_BY_ID
);

const deleteTour = ControllerHandlerFactory.deleteOneDocument(
  Tour,
  DatabaseOperationsConstants.DELETE_SINGLE_DOCUMENT_BY_ID
);

const deleteTourImage = async (req, res) => {
  try {
    const { tourId, tourImageIndex } = req.params;
    // Find the tour by ID
    const tour = await Tour.findById(tourId);

    // Check if the tour exists
    if (!tour) {
      return createHttpResponse(
        res,
        StatusCodes.NOT_FOUND,
        "Failed",
        "Tour not found.",
        null
      );
    }

    if (!toursControllerHelper.isUserGuide(tour, req.user.id)) {
      return createHttpResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Failed",
        "You are not authorized to perform this action.",
        null
      );
    }

    // Remove the image from the images array
    tour.images = tour.images.filter(
      (_, index) => index !== Number(tourImageIndex)
    );

    // Save the updated tour
    await tour.save();

    createHttpResponse(
      res,
      StatusCodes.OK,
      "Success",
      "Image deleted successfully",
      tour
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error. Delete tour image." });
  }
};

const addNewImagesToTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return createHttpResponse(
        res,
        StatusCodes.NOT_FOUND,
        "Failed",
        "Tour not found for the specified tour ID."
      );
    }

    const newImages = req.body.uploadedImageUrls;

    // Add the new image URLs to the existing images array
    tour.images = tour.images.concat(newImages);

    // Save the updated tour with the new images
    await tour.save();

    // Sending the HTTP response with the found tours
    createHttpResponse(
      res,
      StatusCodes.OK,
      "Success",
      "Images uploaded successfully",
      tour
    );
  } catch (error) {
    // Handle any errors that may occur
    createHttpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "An error occurred while fetching tour guides tours."
    );
  }
};

const getAllToursFromTourGuide = async (req, res) => {
  try {
    // Use a regular find query to retrieve tours for the specified tour guide
    const tours = await Tour.find({ guides: req.params.id });

    // Sending the HTTP response with the found tours
    createHttpResponse(
      res,
      StatusCodes.OK,
      "Success",
      "All tour stats aggregated successfully",
      tours
    );
  } catch (error) {
    // Handle any errors that may occur
    createHttpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "An error occurred while fetching tour guides tours."
    );
  }
};

// * Aggregated routes
const getAllToursStats = async (req, res) => {
  /*
   the aggregation pipeline is a framework for data aggregation
   that allows you to process data records and transform them
  into aggregated results based on a series of pipeline stages.
  */
  try {
    const allToursStats = await Tour.aggregate([
      { $match: { ratingAverage: { $gte: 0 } } },
      {
        $group: {
          _id: null,
          totalTours: { $sum: 1 },
          totalRatings: { $sum: "$ratingQuantity" },
          avgRating: { $avg: "$ratingAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          longestTour: { $max: "$duration" },
          shortestTour: { $min: "$duration" },
          biggestTourGroup: { $max: "$maxGroupSize" },
          smallestTourGroup: { $min: "$maxGroupSize" },
        },
      },
      {
        $sort: {
          minPrice: 1,
        },
      },
    ]);

    // ? Sending the HTTP response with the found tours stats
    createHttpResponse(
      res,
      StatusCodes.OK,
      "Success",
      "All tour stats aggregated successfully",
      allToursStats
    );
  } catch (error) {
    // ? Sending the HTTP response with the found tours
    createHttpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed",
      "Something went wrong trying to get tours stats. Please try again later."
    );
  }
};

const getAllToursUniqueDestinations = async (req, res) => {
  try {
    const destinations = await Tour.aggregate([
      {
        $group: {
          _id: "$startLocation", // Group by the startLocation field
          imageCover: { $first: "$imageCover" }, // Get the first imageCover for each group
        },
      },
      {
        $project: {
          _id: 0,
          destination: "$_id", // Rename _id to destination
          imageCover: 1, // Include the imageCover field in the output
        },
      },
    ]);

    createHttpResponse(
      res,
      StatusCodes.OK,
      "Success",
      "All tour stats aggregated successfully",
      destinations
    );
  } catch (error) {
    createHttpResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error",
      "Something went wrong trying to get tour destinations. Please try again later."
    );
  }
};

const getMonthlyStats = async (req, res) => {
  /* Get stats for a specific tour
  This code performs an aggregation query on the Tour collection.
  The first stage, $unwind, is used to create multiple documents from
  each Tour document, one for each startDates value. This is because
  the match and group stages will operate on each startDates value separately.
  The second stage, $match, filters the results to only include documents with
  startDates values between January 1 and December 31 of the specified year.
  The third stage, $group, groups the results by month, counting the number of
  tours that start in each month (numOfTourStartsInTheMonth) and creating an
  array of tour names for each month (tours).
  The fourth stage, $addFields, adds a new field called month to the output,
  which is set to the _id value (i.e., the month number).
  The fifth stage, $project, removes the _id field from the output.
  The sixth stage, $sort, sorts the output by the numOfTourStartsInTheMonth field
  in descending order
  */
  try {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numOfTourStartsInTheMonth: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { numOfTourStartsInTheMonth: -1 } },
      { $limit: 12 },
    ]);

    res.json({
      status: StatusCodes.OK,
      data: plan,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Something went wrong trying to get tours stats. Please try again later.",
    });
  }
};

// * Geospatial routes
// * This function is responsible for finding tours within
// * a certain distance from a given latitude and longitude.
const getToursWithin = async (req, res, next) => {
  // ? Extracting required parameters from the request
  const { distance, latlng, unit } = req.params;

  // ? Checking if all required parameters are provided
  // ? If any parameter is missing, send a Bad Request error
  if (!distance || !latlng || !unit) {
    next(new BadRequestError("Please provide valid request parameters."));
  }
  // ? Splitting the latlng string into latitude and longitude values
  const [lat, lng] = latlng.split(",");

  // ? Calculating the radius of the sphere based on the provided distance and unit
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  // ? Finding tours within the specified location using the startLocation field in the Tour model
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  // ? Sending the HTTP response with the found tours
  createHttpResponse(
    res,
    StatusCodes.OK,
    "Success",
    `Total tours found ${tours.length}`,
    tours
  );
};

// ? This function is responsible for calculating the distances
// ? between tours and a given latitude and longitude.
const getTourDistances = async (req, res, next) => {
  // ? Extracting required parameters from the request
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  // ? Checking if all required parameters are provided
  if (!latlng || !unit) {
    // ? If any parameter is missing, send a Bad Request error
    next(new BadRequestError("Please provide valid request parameters."));
  }
  // ? Determining the distance unit multiplier based on the provided unit
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  // ? Using the Tour model's aggregate function to calculate distances and project relevant fields
  const tourDistances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  // ? Sending the HTTP response with the found tours
  createHttpResponse(
    res,
    StatusCodes.OK,
    "Success",
    `Total tours found ${tourDistances.length}`,
    tourDistances
  );
};

module.exports = {
  getTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  getAllToursStats,
  getMonthlyStats,
  getToursWithin,
  getTourDistances,
  getAllToursUniqueDestinations,
  getAllToursFromTourGuide,
  deleteTourImage,
  addNewImagesToTour,
};
