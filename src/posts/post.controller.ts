import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { PostService } from "./post.service";

export const postController = ({
  [TYPES.PostService]: postService,
}: {
  [TYPES.PostService]: PostService;
}) => ({
  writePost: async (req: Request, res: Response) => {
    try {
      const { title, content, author } = req.body;
      const post = await postService.createPost({ title, content, author });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "게시글 작성중 문제 발생" });
    }
  },
  getPosts: async (req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.json(posts);
  },
});
