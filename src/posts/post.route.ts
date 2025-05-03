import express from "express";
import { makeInvoker } from "awilix-express"; // 🔥 추가
import { postController } from "../posts/post.controller";
import { authenticate } from "../middlewares/authMiddleware";
import { tokenSetting } from "../middlewares/tokenSettingMiddleware";

const router = express.Router();
const api = makeInvoker(postController);
// 1. 게시글 생성
router.post("/", authenticate, api("createPost"));

// 2. 게시글 목록 조회
router.get("/", api("getAllPosts"));

router.get("/subdomain/:subdomain", api("getAllPostsBySubdomain"));

// 3. 게시글 삭제
router.delete("/", authenticate, api("deletePost"));

// 4. 게시글 단건 조회
router.get("/:id", tokenSetting, api("getPost"));

// 5. 게시글 수정
router.put("/:id", authenticate, api("updatePost"));

router.post("/:id/like", authenticate, api("likePost"));
router.delete("/:id/like", authenticate, api("unLikePost"));

export default router;
