import express from "express";
import { scopePerRequest } from "awilix-express";
import container from "./di/container";
import userRouter from "./routes/user.route";

const app = express();
app.use(express.json());
app.use(scopePerRequest(container));
app.use("/users", userRouter);

export default app;
