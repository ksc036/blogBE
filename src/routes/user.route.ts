import express from "express";
import { scopePerRequest, makeInvoker } from "awilix-express"; // 🔥 추가
import { userController } from "../users/user.controller";
import container from "../di/container"; // 🔥 추가
import { getUsers } from "../users/user.controller";

const router = express.Router();
const api = makeInvoker(userController);
router.get("/", api("getUsers"));
// router.get("/list", getUserList); // /users/list 경로 처리
export default router;
