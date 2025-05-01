import express from "express";
import { makeInvoker } from "awilix-express"; // 🔥 추가
import { userController } from "./user.controller";
import container from "../di/container"; // 🔥 추가
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();
const api = makeInvoker(userController);

router.get("/", authenticate, api("getUsers"));
router.get("/blogProfile/:subdomain", api("blogProfileBySubdomain"));

router.put("/", authenticate, api("updateUser"));

router.get("/social/google", api("googleLoginInit")); // /users/social/google 경로 처리
router.get("/social/google/callback", api("googleCallback")); // /users/social/google 경로 처리

router.get("/me", authenticate, api("getMe")); // /users/social/google 경로 처리

router.post("/logout", authenticate, api("logout")); // /users/social/google 경로 처리
// router.get("/list", getUserList); // /users/list 경로 처리
export default router;
