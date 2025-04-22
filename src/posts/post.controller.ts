import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { PostService } from "./post.service";

export const postController = ({
  [TYPES.PostService]: postService,
}: {
  [TYPES.PostService]: PostService;
}) => ({
  createPost: async (req: Request, res: Response) => {
    console.log("createPost called ", req.body);
    try {
      const { title, content, thumbnailUrl, desc, visibility, postUrl } =
        req.body;
      const post = await postService.createPost({
        title,
        content,
        thumbnailUrl,
        desc,
        visibility,
        postUrl,
      });
      res.status(201).json(post);
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
    const posts = await postService.getPost(Number(id));
    res.json(posts);
  },
  updatePost: async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.json(posts);
  },
  deletePost: async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.json(posts);
  },
});
