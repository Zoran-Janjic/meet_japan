/* eslint-disable max-len */
const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
// const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");
// const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants");
// const BadRequestError = require("../errors/index");
const createHttpResponse = require("../helpers/createHttpResponse");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = async (req, res) => {
  // ? Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // ? Create the checkout session

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
    success_url: `${req.protocol}://${req.get("host")}/?tourId/${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
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

const createBookingCheckout = async (session) => {};

module.exports = { getCheckoutSession };
