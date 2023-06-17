const getCurrentUserDetails = (req, _res, next) => {
  console.log("middleware");
  req.params.id = req.user.id;
  next();
};

module.exports = { getCurrentUserDetails };
