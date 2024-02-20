import mongoose, { Schema, model } from "mongoose";
import crypto from "crypto";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      validate: {
        validator: function (v) {
          return v.length > 5;
        },
        message: "Password length should be 5 or more characters",
      },
      required: [true, "Please enter a password"],
      minLength: [5, "Password should have at least 5 characters"],
    },

    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "ticket",
      },
    ],
    passwordResetToken: String,
    passwordResetTokenExpiry: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generatePasswordToken = function () {
  const userToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(userToken)
    .digest("hex");
  this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000;

  console.log({ userToken, resetToken: this.passwordResetToken})
  return userToken;
};

const User = model("user", UserSchema);

export default User;
