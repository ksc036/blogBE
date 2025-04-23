import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { CommentService } from "./comment.service";
import {
  CreateCommentDTO,
  DeleteCommentDTO,
  UpdateCommentDTO,
} from "./comment.dto";

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
  updateComment: async (req: Request, res: Response) => {
    const data: UpdateCommentDTO = req.body;
    const comment = await commentService.updateComment(data);
    res.json(comment);
  },
  deleteComment: async (req: Request, res: Response) => {
    const data: DeleteCommentDTO = req.body;
    const comment = await commentService.deleteComment(data);
    res.json(comment);
  },
});
