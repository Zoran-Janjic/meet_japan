const { StatusCodes } = require("http-status-codes");
const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find().populate({
    path: "tour",
    select: "name",
  });
  // .lean();
  //  ? check later
  // reviews.forEach((reviewIn) => {
  //   if (reviewIn.tour) {
  //     delete reviewIn.tour.tourDurationInWeeks;
  //   }
  // });

  res
    .status(StatusCodes.OK)
    .json({ status: "success", totalReviews: reviews.length, reviews });
};

const createReview = async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ status: "success", newReview });
};

module.exports = { getAllReviews, createReview };
