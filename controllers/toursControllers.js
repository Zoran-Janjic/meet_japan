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
  // ? Get filters if specified
  const queryObj = { ...req.query };

  // ? Exclude from filter and delete it from the query object
  const excludedFields = ["page", "sort", "limit", "fields"];
  // ? Remove the excluded fields from the query object
  excludedFields.forEach((field) => {
    delete queryObj[field];
  });

  // * Step 1 Advanced filtering
  // ? regular expression to search for any occurrence of the filtering operators
  // ? gte, gt, lte, and lt using the \b(gte|gt|lte|lt)\b pattern.
  const queryStep1 = JSON.stringify(queryObj).replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  // ? Create a query with advanced filters
  let createdQuery = Tour.find(JSON.parse(queryStep1));

  // * Step 2 Sorting the query if the sort is requested
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    createdQuery = createdQuery.sort(sortBy);
  } else {
    // ? If not sort provided we add the default one which will sort by the date added
    // ? and will show the newest one first.
    createdQuery = createdQuery.sort("-createdAt");
  }

  // * Step 3 Limit which fields we want to get back so we can reduce the bandwidth for the request
  if (req.query.fields) {
    const requiredFields = req.query.fields.split(",").join(" ");
    createdQuery = createdQuery.select(requiredFields);
  } else {
    // ? If no fields are specified than use the default one which remove the following properties
    createdQuery = createdQuery.select("-__v");
  }

  // * Step 4 Pagination Allowing the request to specify which page of the results they want
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  createdQuery = createdQuery.skip(skip).limit(limit);

  // ? Check if the page exists so we dont skip more than we have pages
  if (req.query.page) {
    const totalTours = await Tour.countDocuments();
    if (skip > totalTours) {
      return res.json({
        status: StatusCodes.BAD_REQUEST,
        message: `Invalid page number: ${page}`,
      });
    }
  }
  // * Step 5 Execute the final query and send result
  const allTours = await createdQuery;

  res.json({
    status: StatusCodes.OK,
    currentPage: page,
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

const deleteTour = async (req, res) => {
  const { tourId } = req.params;
  try {
    // Check if tour exists
    const foundTour = await Tour.findByIdAndDelete(tourId);

    // If tour does not exist send not found response
    if (!foundTour) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: `Tour with ${tourId} does not exist.`,
      });
    }
    // if tour is found and deleted successfully send the deleted tour
    res.json({
      status: StatusCodes.OK,
      message: `Tour deleted successfully with ${tourId}`,
      deletedTour: foundTour,
    });
  } catch {
    // If error oocurs delteting tour send response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Something went wrong trying to delete your tour. Please try again later.",
    });
  }
};

module.exports = {
  getTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
};
