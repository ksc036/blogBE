import express, { Request, Response } from "express";
import { scopePerRequest } from "awilix-express";
import container from "./di/container";
import userRouter from "./users/user.route";
import postRouter from "./posts/post.route";
import mainRouter from "./routes/main.route";
import commentRouter from "./comments/comment.route";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.options(
  "*",
  cors({
    origin: (origin, callback) => {
      callback(null, origin); // 요청 들어온 origin을 그대로 허용
    },
    credentials: true,
  })
);
app.use(express.json());

app.use(scopePerRequest(container));
app.use("/", mainRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
export default app;
