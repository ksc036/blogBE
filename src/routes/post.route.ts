import express from "express";
import { makeInvoker } from "awilix-express"; // 🔥 추가
import { postController } from "../posts/post.controller";

const router = express.Router();
const api = makeInvoker(postController);
// 1. 게시글 생성
router.post("/", api("createPost"));

// 2. 게시글 목록 조회
router.get("/", api("getAllPosts"));

// 3. 게시글 단건 조회
router.get("/:id", api("getPost"));

// 4. 게시글 수정
router.put("/:id", api("updatePost"));

// 5. 게시글 삭제
router.delete("/:id", api("deletePost"));
export default router;
