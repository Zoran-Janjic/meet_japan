const User = require("../../models/User");
const { JsonWebTokenError } = require("../../errors");
const jwt = require("jsonwebtoken");

const protectedRoute = async (req, res, next) => {
  let tokenFromRequest;
  let decodedToken;
  // * Step1: Check if token is present with the request
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    [, tokenFromRequest] = req.headers.authorization.split(" ");
  } else if (req.cookies.jwt) {
    tokenFromRequest = req.cookies.jwt;
    console.log(`Token from the cookie: ${tokenFromRequest}`);
  } else {
    return next(new JsonWebTokenError("Missing token"));
  }

  // * Step2: Token verification
  try {
    decodedToken = jwt.verify(tokenFromRequest, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(new JsonWebTokenError("Invalid signature"));
  }

  // * Step 3: Check if user is still registered
  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    return next(new JsonWebTokenError("User not found"));
  }

  // * Step 4: Check if user changed password after token was issued
  if (currentUser.wasPasswordChangedAfterJWTIssued(decodedToken.iat)) {
    return next(new JsonWebTokenError("Password changed"));
  }

  // * Grant access to the protected route as the user is successfully authenticated
  req.user = currentUser;
  next();
};

module.exports = { protectedRoute };
