const moment = require("moment");
const colors = require("colors/safe");

// * console log requests to the api
const requestLogger = (req, res, next) => {
  console.log(colors.bgWhite.blue("-------------------"));
  console.log(colors.bgWhite.blue("METHOD: ", req.method));
  console.log(colors.bgWhite.blue("PATH: ", req.path));
  console.log(colors.bgWhite.blue("BODY: ", req.body));
  const formattedDate = moment(new Date()).format("MMMM Do YYYY, h:mm:ss a");
  console.log(colors.bgWhite.blue("DATE: ", formattedDate));
  console.log(colors.bgWhite.blue("-------------------"));
  next();
};

module.exports = { requestLogger };
