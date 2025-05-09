import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { PostService } from "./post.service";
import { CreatePostDTO } from "./post.dto";
import { postLike } from "./typs";

export const postController = ({
  [TYPES.PostService]: postService,
}: {
  [TYPES.PostService]: PostService;
}) => ({
  createPost: async (req: Request, res: Response) => {
    console.log("createPost called ", req.body);
    try {
      const userId = (req.tokenPayload as any).id; // ✅ id 꺼내기

      const data: CreatePostDTO = req.body;
      data.userId = userId;
      const postId = await postService.createPost(data);
      res.status(201).json({ postId });
    } catch (error) {
      res.status(500).json({ error: "게시글 작성중 문제 발생" });
    }
  },
  getAllPosts: async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.json(posts);
  },
  getPost: async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.tokenPayload?.id ?? undefined;
    console.log(userId);
    const posts = await postService.getPost(Number(id), userId);
    res.json(posts);
  },
  updatePost: async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("updatePost called ", req.body);
    try {
      const { title, content, thumbnailUrl, desc, visibility, postUrl } =
        req.body;
      const post = await postService.updatePost({
        id: Number(id),
        title,
        content,
        thumbnailUrl,
        desc,
        visibility,
        postUrl,
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
  getAllPostsBySubdomain: async (req: Request, res: Response) => {
    // const host = req.headers.host;
    // const subdomain = host?.split(".")[0];
    const { subdomain } = req.params;
    console.log("서브도메인:", subdomain);
    if (!subdomain) {
      return res.status(400).json({ error: "서브도메인이 없습니다." });
    }
    const posts = await postService.getAllPostsBySubdomain(subdomain);
    res.json(posts);
  },
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
});
