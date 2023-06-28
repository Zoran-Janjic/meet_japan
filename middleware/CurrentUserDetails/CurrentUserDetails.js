const getCurrentUserDetails = (req, _res, next) => {
  req.params.id = req.user.id;
  next();
};

module.exports = { getCurrentUserDetails };
