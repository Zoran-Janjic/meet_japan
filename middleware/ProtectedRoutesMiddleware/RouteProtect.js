const User = require("../../models/User");
const { JsonWebTokenError } = require("../../errors");
const jwt = require("jsonwebtoken");

/*
The protectedRoute function is an Express middleware that provides
authentication and authorization for protected routes in a web application.
It verifies the authenticity of a JSON Web Token (JWT) sent in the request
header or as an HTTP cookie.
The function performs several essential steps to ensure the user is
authorized to access the protected route.

Web app usage:
For the web application, the function checks for the presence
of a JWT (JSON Web Token) in the HTTP cookies of the request.
When users log in or authenticate, the server generates a JWT
and sets it as an HTTP cookie in the response.
Subsequent requests from the web browser automatically
include this cookie in the request headers, allowing the server
to authenticate and identify the user without the need to manually
 include the token in the request.

Web API usage:
For API usage, the function expects the JWT to be included
in the Authorization header of the request.
API clients (e.g., mobile apps, other backend services)
must manually include the JWT as a Bearer token in the
Authorization header when making requests to protected API endpoints.
This approach follows the standard way of API authentication
using the Authorization header with the Bearer scheme.
*/
const protectedRoute = async (req, res, next) => {
  let tokenFromRequest;
  let decodedToken;
  // * Step1: Check if token is present with the request
  console.log("COOKIE: ", req.cookies);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    [, tokenFromRequest] = req.headers.authorization.split(" ");
  } else if (req.cookies.jwt) {
    tokenFromRequest = req.cookies.jwt;
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
