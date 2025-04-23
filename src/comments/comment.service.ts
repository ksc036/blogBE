import { TYPES } from "../di/types";
import { CommentRepository } from "./comment.repository";
export class CommentService {
  private commentRepository: CommentRepository;
  constructor({
    [TYPES.CommentRepository]: commentRepository,
  }: {
    [TYPES.CommentRepository]: CommentRepository;
  }) {
    this.commentRepository = commentRepository;
  }

  getAll() {
    return this.commentRepository.findAll();
  }
}
