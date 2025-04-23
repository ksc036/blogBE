import express from "express";
import { makeInvoker } from "awilix-express";
import { commentController } from "../comments/comment.controller";

const router = express.Router();
const api = makeInvoker(commentController);
router.post("/", api("creaetComment"));
router.put("/", api("updateComment"));
router.delete("/", api("deleteComment"));
export default router;
