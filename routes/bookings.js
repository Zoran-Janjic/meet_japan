const express = require("express");
const router = express.Router();
const applicationMiddleware = require("../middleware/index");
const bookingController = require("../controllers/bookingController");

router.get(
  "/checkout-session/:tourId",
  applicationMiddleware.RouteProtect.protectedRoute,
  applicationMiddleware.RoleRestrictedRoute.restrictTo("user", "tourguide"),
  bookingController.getCheckoutSession
);


module.exports = router;
