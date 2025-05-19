// users/user.repository.ts
import {
  PrismaClient,
  User,
  Comment as PrismaComment,
  Prisma,
} from "@prisma/client";
import {
  CreateCommentDTO,
  DeleteCommentDTO,
  UpdateCommentDTO,
} from "./comment.dto";
import { CreateCommentModel } from "./comment.model";

export class CommentRepository {
  private prisma: PrismaClient;
  // constructor(private readonly prisma = new PrismaClient()) {}
  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }

  async createComment(data: CreateCommentModel): Promise<PrismaComment> {
    return await this.prisma.comment.create({
      data: {
        ...data,
        parentId: data.parentId ?? null,
      },
    });
  }
  async updateComment(data: UpdateCommentDTO): Promise<PrismaComment> {
    console.log("data", data);
    return await this.prisma.comment.update({
      data: {
        content: data.content,
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
