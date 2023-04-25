const topFiveLowestPriceBestReviewTours = (req, res, next) => {
  // * To obtain the top 5 most affordable, top rated tours,
  // * we prefill the req.query with the necessary parameters.  req.query.limit = "5";
  req.query.sort = "price,-ratingAverage";
  req.query.fields = "name,price,ratingAverage,summary,difficulty,discountPrice,imageCover,startDates";
  next();
};

const topFiveRated = (req, res, next) => {
  req.query.sort = "-ratingAverage";
  req.query.fields = "name,price,ratingAverage,summary,difficulty,discountPrice,imageCover,startDates";
  next();
};

module.exports = { topFiveLowestPriceBestReviewTours, topFiveRated };
