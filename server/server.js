import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import 'dotenv/config';
import { v2 as cloudinary } from "cloudinary";

import userRoutes from "./src/routes/user.routes.js";
import postRoutes from "./src/routes/post.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(morgan("dev"));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
