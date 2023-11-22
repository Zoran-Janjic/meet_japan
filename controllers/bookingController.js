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

  // Step 2: Create a Stripe Checkout session using the `stripe.checkout.sessions.create` method.
  const session = await stripe.checkout.sessions.create({
    // Step 3: Define payment method types (in this case, only "card" is specified).
    payment_method_types: ["card"],

    // Step 5: Provide customer details, such as the email address.
    customer_email: req.user.email,

    // Step 6: Set a client reference ID, which can be useful for associating the session with a specific entity (tourId in this case).
    client_reference_id: req.params.tourId,

    // Step 7: Define line items for the purchase, such as the tour details.
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              "https://www.state.gov/wp-content/uploads/2019/04/Japan-2107x1406.jpg",
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // Step 4: Specify success and cancel URLs for redirection after payment completion or cancellation.
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tours/${tour.slug}`,
  });

  // Step 9:
  return createHttpResponse(
    res,
    StatusCodes.OK,
    "Success",
    "Session established.",
    session
  );
};

module.exports = { getCheckoutSession };
