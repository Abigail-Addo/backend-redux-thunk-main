import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema({
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
}, {
  timestamps: true
});

const User = model("user", UserSchema);
export default User;
