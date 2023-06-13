const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
const CustomController = require("../customClasses/CustomController");
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");

// * Route handlers
const getTours = async (req, res) => {
  // *  Custom controller that does all the filtering options as we pass to it
  // * The query object and the query string that we receive
  const filteredQueryObject = new CustomController(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // *  Execute the final query and send result
  const allTours = await filteredQueryObject.query;

  res.json({
    status: StatusCodes.OK,
    totalItems: allTours.length,
    data: allTours,
  });
};

const addTour = async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.json({
    status: StatusCodes.CREATED,
    message: "Created",
    data: newTour,
  });
};

const getTour = async (req, res) => {
  const foundTour = await Tour.findById(req.params.tourId).populate(
    "tourReviews"
  );

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

const deleteTour = ControllerHandlerFactory.deleteOneDocument(Tour);

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

module.exports = {
  getTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  getAllToursStats,
  getMonthlyStats,
};
