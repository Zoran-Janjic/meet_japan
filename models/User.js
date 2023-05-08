const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      required: [true, "User must provide a valid password."],
      minLength: 8,
      // ? Validator only works on CREATE and SAVE
      validate: {
        validator(value) {
          return value === this.password;
        },
        message: "Passwords don't match.",
      },
    },

    lastPasswordChangedDate: { type: Date },
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

// * Document middleware
/*
allows you to add custom logic to be executed before or after certain
events occur on a MongoDB document. This middleware can be used to perform
various tasks, such as validation, data transformation, or triggering other
actions based on changes to a document.
*/

userSchema.pre("save", async function (next) {
  // ? If password has been modified.
  if (!this.isModified("password")) return next();
  // ?  If password has not been modified than we modify it
  this.password = await bcrypt.hash(this.password, 12);

  // ? Not needed anymore as the password is already matched with he confirmation password
  this.passwordConfirmation = undefined;
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

const User = mongoose.model("User", userSchema);

module.exports = User;
