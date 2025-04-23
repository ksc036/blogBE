import { TYPES } from "../di/types";
import { CommentRepository } from "./comment.repository";
interface CreateCommentDTO {
  content: string;
  postId: number;
}
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
    return this.commentRepository.createComment(data);
  }
}
