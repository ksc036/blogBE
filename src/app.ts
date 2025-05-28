import express, { Request, Response } from "express";
import { scopePerRequest } from "awilix-express";
import container from "./di/container";
import userRouter from "./domain/users/user.route";
import postRouter from "./domain/posts/post.route";
import mainRouter from "./mainRoutes/main.route";
import commentRouter from "./domain/comments/comment.route";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin); // 요청 들어온 origin을 그대로 허용
    },
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

app.use(scopePerRequest(container));
app.use("/", mainRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
export default app;
