const express = require("express");
const router = express.Router();
const applicationMiddleware = require("../middleware/index");
const bookingController = require("../controllers/bookingController");

router.post(
  "/checkout-session/:tourId",
  applicationMiddleware.RouteProtect.protectedRoute,
  applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
  bookingController.getCheckoutSession
);

module.exports = router;
