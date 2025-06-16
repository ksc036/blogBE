import express from "express";
import { makeInvoker } from "awilix-express"; // 🔥 추가
import { postController } from "./post.controller";
import { authenticate } from "../../middlewares/authMiddleware";
import { tokenSetting } from "../../middlewares/tokenSettingMiddleware";

const router = express.Router();
const api = makeInvoker(postController);
// 1. 게시글 생성
router.post("/", authenticate, api("createPost"));

// 2. 게시글 목록 조회
router.get("/", api("getAllPosts"));

// router.get("/subdomain/:subdomain", api("getAllPostsBySubdomain"));

// 3. 게시글 삭제
router.delete("/", authenticate, api("deletePost"));

router.get("/review", authenticate, api("getReviewPosts"));
router.get("/reviewStatus", authenticate, api("reviewStatus"));
router.get("/getUserPlanList", authenticate, api("getUserPlanList"));
router.post("/reviewPlan", authenticate, api("addReviewPlan"));
router.delete("/reviewPlan", authenticate, api("deleteReviewPlan"));
router.post("/reviewInstance", authenticate, api("addReviewInstance"));
router.delete("/reviewInstance", authenticate, api("removeReviewInstance"));
router.put("/reviewSuccess", authenticate, api("reviewSuccess"));
// 4. 게시글 단건 조회
router.get("/:id", tokenSetting, api("getPost"));

// 5. 게시글 수정
router.put("/:id", authenticate, api("updatePost"));
router.post("/:id/like", authenticate, api("likePost"));
router.delete("/:id/like", authenticate, api("unLikePost"));

// 6.게시글 하나검색
router.get("/:subdomain/:id", tokenSetting, api("getPostBySubdomainAndId"));
export default router;
