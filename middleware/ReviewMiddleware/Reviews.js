const setTourAndUserIdForReview = (req, _res, next) => {
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const setTourGuideIdAndUserId = (req, _res, next) => {
  if (!req.body.tourGuide) req.body.tourGuide = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

module.exports = { setTourAndUserIdForReview, setTourGuideIdAndUserId };
