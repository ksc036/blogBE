import express from "express";
import { makeInvoker } from "awilix-express"; // 🔥 추가
import { userController } from "./user.controller";
import container from "../di/container"; // 🔥 추가
import { authenticate } from "../middlewares/authMiddleware";
import { tokenSetting } from "../middlewares/tokenSettingMiddleware";

const router = express.Router();
const api = makeInvoker(userController);

router.get("/", authenticate, api("getUsers"));
router.get(
  "/blogProfile/:subdomain",
  tokenSetting,
  api("blogProfileBySubdomain")
);

router.put("/", authenticate, api("updateUser"));

router.get("/social/google", api("googleLoginInit")); // /users/social/google 경로 처리
router.get("/social/google/callback", api("googleCallback")); // /users/social/google 경로 처리

router.get("/me", authenticate, api("getMe")); // /users/social/google 경로 처리

router.post("/logout", authenticate, api("logout")); // /users/social/google 경로 처리

// 팔로우 요청 (로그인한 사용자가 :id 유저를 팔로우)
router.post("/:id/follow", authenticate, api("followUser"));

// 언팔로우 요청
router.delete("/:id/follow", authenticate, api("unfollowUser"));

// 내가 팔로우하고 있는 유저 리스트
router.get("/me/followings", authenticate, api("getFollowings"));

// 나를 팔로우하고 있는 유저 리스트
router.get("/me/followers", authenticate, api("getFollowers"));
export default router;
