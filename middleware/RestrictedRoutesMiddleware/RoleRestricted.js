const { NoPermissionError } = require("../../errors/index");

//  As we cannot apss apramtres to the the middlware we need to use a wraper fucntion

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array
    if (!roles.includes(req.user.role)) {
      return next(
        new NoPermissionError(
          `You do not have permission to perform this action as a :${req.user.role}'`
        )
      );
    }
    next();
  };
};

module.exports = { restrictTo };
