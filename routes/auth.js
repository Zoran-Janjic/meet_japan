const express = require("express");
const authController = require("../controllers/authController");
const applicationMiddleware = require("../middleware/index");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:resetToken", authController.resetPassword);
router.patch(
  "/updatePassword",
  applicationMiddleware.RouteProtect.protectedRoute,
  authController.updatePassword
);

module.exports = router;
