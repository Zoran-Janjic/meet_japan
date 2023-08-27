const express = require("express"); // ? Import express module
const userRouter = express.Router(); // ? Create a router object
const usersController = require("../controllers/usersController"); // ? Import usersController module
const applicationMiddleware = require("../middleware/index"); // ? Import middleware module

// ? Agregated tourguide routes which are not protected

userRouter
  .route("/tourGuides/topSixTourGuides")
  .get(usersController.getTopSixTourGuides);

// ? All endpoints middleware
// ? Apply protectedRoute middleware for authentication
userRouter.use(applicationMiddleware.RouteProtect.protectedRoute);

// ? Route for updating user or deleting self
userRouter
  .route("/")
  .patch(
    usersController.updateUser // ? Handle user update logic
  )
  .delete(
    usersController.deleteSelfUser // ? Handle user deletion logic
  );

// ? Route for getting current user details
userRouter.route("/me").get(
  // ? Apply getCurrentUserDetails middleware
  applicationMiddleware.CurrentUserIdMiddleware.getCurrentUserDetails,
  usersController.getCurrentUserDetails // ? Handle getting current user details logic
);

// ? Route for getting a specific user by ID
userRouter.route("/:id").get(
  usersController.getUser // ? Handle getting a specific user by ID logic
);

// ? Tour guides routes

userRouter.route("/tourguide/:id").get(usersController.getTourGuideUser);

module.exports = userRouter; // ? Export the router object for use in other modules
