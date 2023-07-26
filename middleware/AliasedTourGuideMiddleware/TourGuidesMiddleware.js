const topSixTourGuidesByRating = (req, res, next) => {
  (req.query.sort = "-rating"),
    (req.query.limit = "6"),
    (req.query.fields = "name,photo,role,rating,");
};

module.exports = { topSixTourGuidesByRating };
