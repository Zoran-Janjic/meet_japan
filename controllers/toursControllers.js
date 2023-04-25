const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
const CustomController = require("../customClasses/CustomController");

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
