import { TYPES } from "../di/types";
import { DeleteCommentDTO, UpdateCommentDTO } from "./comment.dto";
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
  async updateComment(data: UpdateCommentDTO) {
    return this.commentRepository.updateComment(data);
  }
  async deleteComment(data: DeleteCommentDTO) {
    return this.commentRepository.deleteComment(data);
  }
}
