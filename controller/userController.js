import { generateToken } from "../helpers/generateToken.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

export const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (password.length < 5) {
    res.status(400);
    throw new Error("Password length should be 5 or more characters");
  }
  if (userExist) {
    res.status(409);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  console.log(salt);

  const hashedPassword = await bcrypt.hash(password, salt);

  // const Newuser = new User({
  //   email,
  //   password: hashedPassword,
  // });
  // await Newuser.save();
  // async handler package - does the try catch behind the scene for you

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

// authentication- confirming a users details
// authorization- gaining access to certain pages

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // const check = await bcrypt.compare(password, user.password);

  // if (user && check) {
  //   const token = generateToken(user._id);

  //   res.status(200).json({
  //     _id: user._id,
  //     email: user.email,
  //     token,
  //   });
  // } else {
  //   return res.status(401).json({ error: "Wrong email or password" });
  // }

  if (user) {
    const check = await bcrypt.compare(password, user.password);

    if (check) {
      const token = generateToken(user._id);

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
      throw new Error("Wrong email or password");
    }
  } else {
    res.status(401);
    throw new Error("Wrong email or password");
  }
});

export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: -1 });

  res.sendStatus(200);
};

export const allTicketsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password").populate("tickets");

  res.send(user);
});






// export const signup = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userExist = await User.findOne({ email });

//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (password.length < 5) {
//       return res
//         .status(400)
//         .json({ message: "Password length should be 5 or more characters" });
//     }
//     if (userExist) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     console.log(salt);

//     const hashedPassword = await bcrypt.hash(password, salt);

//     // const Newuser = new User({
//     //   email,
//     //   password: hashedPassword,
//     // });
//     // await Newuser.save();
//     // async handler package - does the try catch behind the scene for you

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user.id,
//         email: user.email,
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     // console.error(error.errors.email.properties.path === "email");
//     if (error.errors.email.properties.path === "email") {
//       res.status(400).json(error.errors.email.properties.path);
//     }
//   }
// };
