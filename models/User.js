const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//* Util functions

function generateRandomToken() {
  /*
The generateRandomToken function in your example generates a random token using crypto.
randomBytes, and then applies a SHA-256 hash to the token using the createHash, update
, and digest methods of the crypto module.
Here's a breakdown of what each step does:
crypto.randomBytes(32) generates a buffer of 32 random bytes.
.toString("hex") converts the buffer to a hexadecimal string.
createHash("sha256") creates a new SHA-256 hash object.
.update(resetToken) updates the hash object with the random token.
.digest("hex") produces the final hash value as a hexadecimal string.
So, the output of this function is not the original random token, but rather its SHA-256 hash value.
This can be useful for generating secure tokens that are resistant to tampering or guessing.
However, note that the resulting token will be longer (64 characters, in this case)
than the original random token (32 characters), due to the additional length added
by the SHA-256 hash. If you need a token of a specific length, you may want
to modify the function accordingly.
  */
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedToken };
}
// * End of util functions

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "User must have a name."],
      minLength: 2,
      maxLength: 30,
      validate: [
        {
          validator: (value) =>
            validator.isAlphanumeric(value, "en-US", { ignore: " " }),
          message: "Name can only contain alphanumeric characters.",
        },
      ],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "User must provide a valid email."],
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    photo: String,
    password: {
      type: String,
      required: [true, "User must provide a valid password."],
      minLength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "tourguide"],
      default: "user",
    },
    passwordConfirmation: {
      type: String,
      required: [true, "User must provide a valid confirmation password."],
      minLength: 8,
      // ? Validator only works on CREATE and SAVE
      validate: {
        validator(value) {
          return value === this.password;
        },
        message: "Passwords don't match.",
      },
    },
    passwordResetToken: { type: String },
    passwordResetTokenExpiration: { type: Date },
    lastPasswordChangedDate: { type: Date },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const newObj = { ...ret };
        newObj.id = ret._id;
        delete newObj._id;
        delete newObj.__v;
        return newObj;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        const newObj = { ...ret };
        delete newObj._id;
        return newObj;
      },
    },
  }
);

// * Virtual properties
/*
  virtual properties are fields that are not stored in the database,
  but are calculated on-the-fly based on other fields in the document.
  Virtual properties can be useful for adding additional computed properties
  to a document without actually storing them in the database.
  - Virtuals cannot be used in a query as they are not saved to the database but
   made on the database query
*/

userSchema.virtual("tourGuideReviews", {
  ref: "TourGuideReview",
  foreignField: "user",
  localField: "_id",
});

// * End of virtual properties

// * Document middleware
/*
allows you to add custom logic to be executed before or after certain
events occur on a MongoDB document. This middleware can be used to perform
various tasks, such as validation, data transformation, or triggering other
actions based on changes to a document.
*/

// ? Hash password on new user registration
userSchema.pre("save", async function (next) {
  // ? If password has been modified.
  if (!this.isModified("password")) return next();
  // ?  If password has not been modified than we modify it
  this.password = await bcrypt.hash(this.password, 12);

  // ? Not needed anymore as the password is already matched with he confirmation password
  this.passwordConfirmation = undefined;
  next();
});

// ? Update the password changed at when the user changes their password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.lastPasswordChangedDate = Date.now() - 1000;
  console.log(this);
  next();
});

//  * Instance methods available for all document of the User collection

// ? Check the user password match on login
userSchema.methods.checkPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ? Issue a token for the user
userSchema.methods.createToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_ID,
    issuer: "Meet Japan",
  });
};

// ? Check if user has changed password after jwt was issued
userSchema.methods.wasPasswordChangedAfterJWTIssued = function (jwtIssuedTime) {
  if (this.lastPasswordChangedDate) {
    const changedPasswordDate = parseInt(
      this.lastPasswordChangedDate.getTime() / 1000,
      10
    );

    // ? False means that the password was not changed during the last issued token expiration date
    return jwtIssuedTime < changedPasswordDate;
  }
};

// ? Create a reset token in case user forgot password
userSchema.methods.createPasswordResetToken = function () {
  const { resetToken, hashedToken } = generateRandomToken();

  this.passwordResetToken = hashedToken;
  //  Reset token valid for 10 minutes
  this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 1000;

  //  Return the reset token to be send with the reset email
  return resetToken;
};

// *  End of instance methods

// * Query middleware
// ? All query that start with find return only the active users
userSchema.pre("/^find/", function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// * End of query middleware

const User = mongoose.model("User", userSchema);

module.exports = User;
