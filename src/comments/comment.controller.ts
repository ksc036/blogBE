import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { CommentService } from "./comment.service";

export const commentController = ({
  [TYPES.CommentService]: commentService,
}: {
  [TYPES.CommentService]: CommentService;
}) => ({
  getComments: async (req: Request, res: Response) => {
    const users = await commentService.getAll();
    res.json(users);
  },
});
