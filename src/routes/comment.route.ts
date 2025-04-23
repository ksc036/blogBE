import express from "express";
import { makeInvoker } from "awilix-express";
import { commentController } from "../comments/comment.controller";

const router = express.Router();
const api = makeInvoker(commentController);
router.get("/", api("getComments"));
// router.get("/list", getUserList); // /users/list 경로 처리
export default router;
0;
