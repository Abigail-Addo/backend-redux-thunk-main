import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./db.js";
import ticketRoute from "./routes/ticketRoute.js";
import userRoute from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: "http://localhost:8082",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(ticketRoute);
app.use(userRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
