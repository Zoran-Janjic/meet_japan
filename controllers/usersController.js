// Import necessary modules and files
const { StatusCodes } = require("http-status-codes"); // Import StatusCodes from http-status-codes module
const User = require("../models/User"); // Import User model
const helpers = require("../helpers/index"); // Import helper functions
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory"); // Import Controller Handler Factory
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants"); // Import Database Operations Constants
const TourGuideReview = require("../models/TourGuideReview"); // Import TourGuideReview model

// ? Get single user
const getUser = ControllerHandlerFactory.getDocument(
  User,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID,
  { path: "tourGuideUserReviews" }
);

const getTourGuideUser = ControllerHandlerFactory.getDocument(
  User,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID,
  { path: "tourGuideUserReviews" }
);

// ? Update user details for only updating the data which is not the password
const updateUser = async (req, res) => {
  const fieldsToRemove = [
    "passwordResetToken",
    "passwordResetTokenExpiration",
    "lastPasswordChangedDate",
    "password",
    "role",
    "passwordConfirmation",
  ];

  if (Object.keys(req.body).length > 0) {
    const filteredUserUpdateObject = helpers.filterUpdateUserObject(
      req.body,
      fieldsToRemove
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredUserUpdateObject,
      {
        new: true,
        runValidators: true,
      }
    );

    // ? Create an HTTP response with success status and updated user details
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      "success",
      `User details updated successfully for user ${updatedUser.name}`,
      updatedUser
    );
  } else {
    // ? Create an HTTP response with success status and a message if no data is
    // ?  provided to update the user details
    helpers.createHttpResponse(
      res,
      StatusCodes.OK,
      "success",
      `No data provided to update the user ${req.user.name} details. Please try again.`,
      updateUser
    );
  }
};

// ? Delete self by the user which sets their active property to false as only admin
// ? can delete users from the db
const deleteSelfUser = async (req, res) => {
  const foundUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  console.log("im here", foundUser);
  // ? Create an HTTP response with success status and a message confirming the deletion
  helpers.createHttpResponse(
    res,
    StatusCodes.OK,
    "success",
    `User ${foundUser.name} deleted successfully.`
  );
};

// ? Get current user details
const getCurrentUserDetails = ControllerHandlerFactory.getDocument(
  User,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID
);

// * Aggregated routes
const getTopSixTourGuides = async (req, res) => {
  /*
   the aggregation pipeline is a framework for data aggregation
   that allows you to process data records and transform them
  into aggregated results based on a series of pipeline stages.
  */

  // Add a static method to calculate average rating for each tour guide
  try {
    const topSixTourGuides = await TourGuideReview.aggregate([
      {
        $group: {
          _id: "$tourGuide",
          totalRatings: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
      {
        $sort: { avgRating: -1 },
      },
      {
        $limit: 6, // Limit to the top 6 tour guides with the best rating
      },
      {
        $lookup: {
          from: "users", // The name of the User collection
          localField: "_id", // The field in the TourGuideReview collection to match
          foreignField: "_id", // The field in the User collection to match
          as: "tourGuideData", // The field in the result where the tour guide data will be stored
        },
      },
      {
        $unwind: "$tourGuideData", // Unwind the tourGuideData array created by the lookup stage
      },
      {
        $project: {
          _id: 1,
          id: "$_id", // Rename _id to id
          totalRatings: 1,
          avgRating: 1,
          tourGuideName: "$tourGuideData.name",
          tourGuidePhoto: "$tourGuideData.photo",
        },
      },
    ]);
    res.json({
      status: StatusCodes.OK,
      data: topSixTourGuides,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Something went wrong trying to get tours stats. Please try again later.",
    });
  }
};

// * End of aggregated routes

// ? Export the functions to be used by other modules
module.exports = {
  getUser,
  updateUser,
  deleteSelfUser,
  getCurrentUserDetails,
  getTourGuideUser,
  getTopSixTourGuides,
};
