import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  workedOn: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const ticket = mongoose.model("ticket", ticketSchema);
export default ticket;

// if using common js use module.exports and not export default
