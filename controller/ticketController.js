import ticketModel from "../model/ticketModel.js";
import User from "../model/userModel.js";
// import ticket from '../model/ticketModel';
import asyncHandler from "express-async-handler";

// fetching all tickets
const allTickets = asyncHandler(async (req, res) => {
  const tickets = await ticketModel.find();
  res.status(200).send(tickets);
});

const addTicket = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.params;
  const ticket = new ticketModel({
    title,
    description,
    user: userId,
  });

  // save to ticket collection for the user
  const result = await ticket.save();

  const fetchUser = await User.findById(userId);

  fetchUser.tickets.push(result);
  // save to the user collection for the tickets array
  await fetchUser.save();

  res.status(201).send(result);
});

const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedTicket = await ticketModel.findByIdAndDelete(id);
  if (deletedTicket) {
    res.status(201).send(deletedTicket);
  }
});

// depends on use case on the front end
// fetch the data record and toggle btn worked on to be true or false
const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ticket = await ticketModel.findById(id);
  // console.log(ticket)
  const updatedTicket = await ticketModel.findByIdAndUpdate(
    { _id: id },
    { workedOn: !ticket.workedOn },
    { new: true }
  );

  if (updatedTicket) {
    res.send(updatedTicket);
  }
});

export default {
  allTickets,
  addTicket,
  deleteTicket,
  updateTicket,
};
