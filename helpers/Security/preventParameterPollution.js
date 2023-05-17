const hpp = require("hpp");

const preventParameterPollution = () => {
  return hpp({
    whitelist: [
      "difficulty",
      "ratingsQuantity",
      "duration",
      "ratingsAverage",
      "maxGroupSize",
      "price",
    ],
  });
};

module.exports = preventParameterPollution;
