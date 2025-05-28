import { TYPES } from "../../di/types";
import {
  CreateCommentDTO,
  DeleteCommentDTO,
  UpdateCommentDTO,
} from "./comment.dto";
import { CommentRepository } from "./comment.repository";
import { CreateCommentModel } from "./comment.model";

export class CommentService {
  private commentRepository: CommentRepository;
  constructor({
    [TYPES.CommentRepository]: commentRepository,
  }: {
    [TYPES.CommentRepository]: CommentRepository;
  }) {
    this.commentRepository = commentRepository;
  }

  async createComment(data: CreateCommentDTO) {
    if (!data.userId) {
      throw new Error("userId가 없습니다.");
    }
    return this.commentRepository.createComment(data as CreateCommentModel);
  }
  async updateComment(data: UpdateCommentDTO) {
    return this.commentRepository.updateComment(data);
  }
  async deleteComment(data: DeleteCommentDTO) {
    return this.commentRepository.deleteComment(data);
  }
}
