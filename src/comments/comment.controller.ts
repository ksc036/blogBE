import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { CommentService } from "./comment.service";
import { CreateCommentDTO } from "./comment.dto";

export const commentController = ({
  [TYPES.CommentService]: commentService,
}: {
  [TYPES.CommentService]: CommentService;
}) => ({
  creaetComment: async (req: Request, res: Response) => {
    const data: CreateCommentDTO = req.body;
    const comment = await commentService.createComment(data);
    res.json(comment);
  },
});
