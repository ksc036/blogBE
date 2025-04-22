import express, { Request, Response } from "express";
import { scopePerRequest } from "awilix-express";
import container from "./di/container";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from "./routes/main.route";

dotenv.config();
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use(scopePerRequest(container));
app.use("/", mainRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
export default app;
