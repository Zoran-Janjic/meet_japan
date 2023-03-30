const moment = require("moment");

const requestLogger = (req, res, next) => {
  console.log("-------------------");
  console.log("METHOD: ", req.method);
  console.log("PATH: ", req.path);
  console.log("BODY: ", req.body);
  const formattedDate = moment(new Date()).format("MMMM Do YYYY, h:mm:ss a");
  console.log("DATE: ", formattedDate);
  console.log("-------------------");
  next();
};

module.exports = { requestLogger };
