// users/user.repository.ts
import { PrismaClient, User, Comment as PrismaComment } from "@prisma/client";
import {
  CreateCommentDTO,
  DeleteCommentDTO,
  UpdateCommentDTO,
} from "./comment.dto";

export class CommentRepository {
  private prisma: PrismaClient;
  // constructor(private readonly prisma = new PrismaClient()) {}
  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }

  async createComment(data: CreateCommentDTO): Promise<PrismaComment> {
    return await this.prisma.comment.create({
      data: {
        ...data,
        userId: 1, // 로그인 유저 ID 등
        parentId: data.parentId ?? null,
      },
    });
  }
  async updateComment(data: UpdateCommentDTO): Promise<PrismaComment> {
    return await this.prisma.comment.update({
      data: {
        ...data,
        userId: 1,
      },
      where: {
        id: data.id,
      },
    });
  }

  async deleteComment(data: DeleteCommentDTO): Promise<number> {
    const deletedComment = await this.prisma.comment.update({
      data: {
        isDeleted: true,
      },
      where: {
        id: data.id,
      },
    });
    const postId = deletedComment.id;
    return postId;
  }

  // async update(id: number, data: Partial<User>): Promise<User | null> {
  //   return this.prisma.user.update({ where: { id }, data });
  // }

  // async delete(id: number): Promise<User> {
  //   return this.prisma.user.delete({ where: { id } });
  // }
}
