const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants");
const BadRequestError = require("../errors/index");
const createHttpResponse = require("../helpers/createHttpResponse");
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
          /* If we add _id: difficutly, it will group them based on the difficulty
          with all the different stats included. ID is what we use to decide which
          field to aggregate upon and it goes through each document and adds up.
          For instance, we can observe that the ratings for the easiest tours are
          the lowest and the highest
          and for the medium are the best ratings. So we can use it to get statistics for the tours
          example :
           _id: "$difficulty",
           {
            "_id": "difficult",
            "totalTours": 2,
            "totalRatings": 12,
            "avgRating": 2.5,
            "avgPrice": 1997,
            "minPrice": 997,
            "maxPrice": 2997
        },
        {
            "_id": "easy",
            "totalTours": 4,
            "totalRatings": 3,
            "avgRating": 1.75,
            "avgPrice": 1272,
            "minPrice": 397,
            "maxPrice": 1997
        },
        {
            "_id": "medium",
            "totalTours": 3,
            "totalRatings": 2,
            "avgRating": 2,
            "avgPrice": 1663.6666666666667,
            "minPrice": 497,
            "maxPrice": 2997
        }
          */
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

    res.json({
      status: StatusCodes.OK,
      data: allToursStats,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Something went wrong trying to get tours stats. Please try again later.",
    });
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
};
