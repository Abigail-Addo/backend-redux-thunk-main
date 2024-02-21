import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import { generateToken } from "../helpers/generateToken.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../helpers/sendEmail.js";

export const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("all fields are required");
  }

  if (password.length < 5) {
    res.status(400);
    throw new Error("password should be 5 or more characters");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error("user already exist");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const check = await bcrypt.compare(password, user.password);

    if (check) {
      // generate jwt token
      const token = generateToken(user._id);

      // set cookies for subsequent requests
      res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(200).json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error("wrong email or password");
    }
  } else {
    res.status(401);
    throw new Error("wrong email or password");
  }
});

export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: -1 });

  res.sendStatus(200);
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // const user = new User();
  // await user.save;
  // User.generateToken()

  if (user) {
    const token = user.generatePasswordToken();

    await user.save({validateBeforeSave: false})

    const emailUrl = `https:localhost:8082/reset-password/${token}`;

    const message = `Hello ${user.email},\n\nPlease click on the following link to reset your password:\n\n${emailUrl}\n\nThis link expires in 10 minutes\n\nIf you did not make this request, please ignore this email and your password will remain unchanged.\n\nSincerely,\nAbigail`

    const options = {
      email: user.email,
      subject: 'Password rest request',
      text: message
    }

    const send = await sendEmail(options)

    if (send) {
      res.status(200).json({message: "success", send })
    } else {
      res.status(500)
      throw new Error("Email could not be sent")
    }


  } else {
    res.status(404);
    throw new Error("Email not found please signup");
  }
});

export const allTicketsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password").populate("tickets");
  res.send(user);
});
