import express from "express";
import { makeInvoker } from "awilix-express";
import { commentController } from "./comment.controller";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();
const api = makeInvoker(commentController);
router.post("/", authenticate, api("creaetComment"));
router.put("/", authenticate, api("updateComment"));
router.delete("/", authenticate, api("deleteComment"));
export default router;
