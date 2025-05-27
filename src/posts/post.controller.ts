import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { PostService } from "./post.service";
import { CreatePostDTO } from "./post.dto";
import { postLike } from "./typs";

type postControllerDependencies = {
  [TYPES.PostService]: PostService;
};
export const postController = (deps: postControllerDependencies) => {
  const postService = deps[TYPES.PostService] as PostService;

  return {
    createPost: async (req: Request, res: Response) => {
      console.log("createPost called ", req.body);
      try {
        const userId = (req.tokenPayload as any)?.id; // ✅ id 꺼내기

        const data: CreatePostDTO = req.body;
        console.log("req.body : ", req.body);
        console.log("data", data);
        data.userId = userId;
        const post = await postService.createPost(data);
        res.status(201).json({ post });
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "게시글 작성중 문제 발생" });
      }
    },
    getAllPosts: async (req: Request, res: Response) => {
      const { page } = req.query;
      console.log("getAllPosts called page", page);
      const data = await postService.getAllPosts(page ? Number(page) : 1);
      res.json(data);
    },
    getPost: async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.tokenPayload?.id ?? undefined;
      console.log(userId);
      const post = await postService.getPost(Number(id), userId);
      res.json(post);
    },
    updatePost: async (req: Request, res: Response) => {
      const { id } = req.params;
      console.log("updatePost called ", req.body);
      try {
        const {
          title,
          content,
          thumbnailUrl,
          desc,
          visibility,
          postUrl,
          tags,
        } = req.body;
        const post = await postService.updatePost({
          id: Number(id),
          title,
          content,
          thumbnailUrl,
          desc,
          visibility,
          postUrl,
          tags,
          userId: (req.tokenPayload as any).id,
        });
        console.log("post", post);
        res.status(201).json({ post });
      } catch (error) {
        res.status(500).json({ error: "게시글 작성중 문제 발생" });
      }
    },
    deletePost: async (req: Request, res: Response) => {
      const { id } = req.body;
      const posts = await postService.deletePost(id);
      res.json(posts);
    },
    // getAllPostsBySubdomain: async (req: Request, res: Response) => {
    //   // const host = req.headers.host;
    //   // const subdomain = host?.split(".")[0];
    //   const { subdomain } = req.params;
    //   console.log("서브도메인:", subdomain);
    //   if (!subdomain) {
    //     return res.status(400).json({ error: "서브도메인이 없습니다." });
    //   }
    //   const posts = await postService.getAllPostsBySubdomain(subdomain);
    //   res.json(posts);
    // },
    likePost: async (req: Request, res: Response) => {
      // const userId = 2;
      const userId = (req.tokenPayload as any).id;
      const { id } = req.params;
      const data: postLike = { userId, postId: Number(id) };
      console.log(data);
      const posts = await postService.addPostLike(data);
      res.json(posts);
    },
    unLikePost: async (req: Request, res: Response) => {
      // const userId = 2;
      const userId = (req.tokenPayload as any).id;
      const { id } = req.params;
      const data: postLike = { userId, postId: Number(id) };
      const posts = await postService.deletePostLike(data);
      res.json(posts);
    },
    getPostBySubdomainAndId: async (req: Request, res: Response) => {
      const { id, subdomain } = req.params;
      const userId = req.tokenPayload?.id ?? undefined;
      const postIdResult = await postService.getPostId(subdomain, id);
      console.log(
        "id",
        id,
        "subdomain",
        subdomain,
        "userId",
        userId,
        "postIdResult",
        postIdResult
      );
      if (!postIdResult) {
        // 예외 처리: 없는 게시글일 수 있음
        throw new Error("Post not found");
      }
      console.log("postIdResult:", postIdResult);
      const postId = postIdResult;
      const post = await postService.getPost(Number(postId), userId);
      res.json(post);
    },
  };
};
