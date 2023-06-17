const express = require("express"); // ? Import express module
const applicationMiddleware = require("../middleware/index"); // ? Import middleware module
const adminRouter = express.Router(); // ? Create a router object
const adminController = require("../controllers/adminController"); // ? Import adminController module

// ? Apply middleware for authentication and role restriction to admin routes
adminRouter.use(
  // ? Apply protectedRoute middleware for authentication
  applicationMiddleware.RouteProtect.protectedRoute,
  applicationMiddleware.RoleRestrictedRoute.restrictTo("admin") // ? Apply restrictTo middleware to restrict access to "admin" role
);

// ? Route for deleting a user by admin
adminRouter.route("/:id").delete(adminController.deleteUserByAdmin);

// ? Route for updating user details by admin
adminRouter.route("/:id").patch(adminController.updateUserDetails);

// ? Route for getting all users (admin-specific)
adminRouter.route("/all").get(adminController.getUsers);

module.exports = adminRouter; // ? Export the router object for use in other modules
