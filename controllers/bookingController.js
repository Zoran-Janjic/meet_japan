/* eslint-disable max-len */
const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
const Booking = require("../models/Booking");
const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");
const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants");
const BadRequestError = require("../errors/index");
const createHttpResponse = require("../helpers/createHttpResponse");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = async (req, res) => {
  //! Refactor befor deploy
  // ? Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // ? Create the checkout session
  console.log(req.params);
  const product = await stripe.products.create({
    name: `${tour.name} Tour`,
    description: tour.summary,
    images: [`${tour.imageCover}`],
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: tour.price * 100,
    currency: "usd",
  });

  // Step 2: Create a Stripe Checkout session using the `stripe.checkout.sessions.create` method.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // ! Change before deployment
    success_url: `http://localhost:5000/api/v1/booking/tour/${req.params.tourId}/user/${req.user.id}/price/${tour.price}`,
    cancel_url: "http://localhost:3000/checkout/cancel",
    consent_collection: {
      terms_of_service: "required",
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: "I agree to the Terms of Service",
      },
    },
    allow_promotion_codes: true,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    mode: "payment",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
  });

  return createHttpResponse(
    res,
    StatusCodes.OK,
    "Success",
    "Session established.",
    session.url
  );
};

// const cancelBookedTour = async (req, res) => {
//   const booking = await Booking.findOneAndDelete({
//     tour: req.params.tourId,
//     user: req.user.id,
//   });

//   if (!booking) {
//     return createHttpResponse(
//       res,
//       StatusCodes.BAD_REQUEST,
//       "Fail",
//       "No booking found with that ID."
//     );
//   }
//   return createHttpResponse(
//     res,
//     StatusCodes.OK,
//     "Success",
//     "Booking canceled.",
//     booking
//   );
// };

const createBooking = ControllerHandlerFactory.createDocument(
  Booking,
  DatabaseOperationsConstants.CREATE_NEW_DOCUMENT
);

const updateBooking = ControllerHandlerFactory.updateDocument(
  Booking,
  DatabaseOperationsConstants.UPDATE_SINGLE_DOCUMENT_BY_ID
);

const getAllBookings = ControllerHandlerFactory.getAllDocuments(
  Booking,
  DatabaseOperationsConstants.GET_ALL_DOCUMENTS
);

const getBooking = ControllerHandlerFactory.getDocument(
  Booking,
  DatabaseOperationsConstants.GET_DOCUMENT_BY_ID,
  {}
);

const deleteBooking = ControllerHandlerFactory.deleteOneDocument(
  Booking,
  DatabaseOperationsConstants.DELETE_SINGLE_DOCUMENT_BY_ID
);

module.exports = {
  createBooking,
  getCheckoutSession,
  updateBooking,
  getAllBookings,
  getBooking,
  deleteBooking,
};
