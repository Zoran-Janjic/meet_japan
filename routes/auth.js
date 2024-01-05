const express = require("express"); // ? Import express module
const authController = require("../controllers/authController"); // ? Import authController module
const applicationMiddleware = require("../middleware/index"); // ? Import middleware module

const router = express.Router(); // ? Create a router object

// ? Route for user registration
router.post("/register", authController.registerUser);

// ? Route for user login
router.post("/login", authController.loginUser);

// ? Route for initiating password reset
router.post("/forgotPassword", authController.forgotPassword);

// ? Route for resetting password using reset token
router.patch("/resetPassword/:resetToken", authController.resetPassword);

// ? Route for resetting password using reset token
router.patch("/verify/:verifyToken", authController.confirmEmail);

// ? Route for updating password
router.patch(
  "/updatePassword",
  // ? Apply protectedRoute middleware for authentication
  applicationMiddleware.RouteProtect.protectedRoute,
  authController.updatePassword
);

module.exports = router; // ? Export the router object for use in other modules
