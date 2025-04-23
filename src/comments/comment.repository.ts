// users/user.repository.ts
import { PrismaClient, User } from "@prisma/client";
import { CreateCommentDTO } from "./comment.dto";

export class CommentRepository {
  private prisma: PrismaClient;
  // constructor(private readonly prisma = new PrismaClient()) {}
  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }

  async createComment(data: CreateCommentDTO): Promise<User[]> {
    const createdComment = await this.prisma.comment.create({
      data,
    });
    const postId = createdComment.id;
    return postId;
  }

  // async create(data: { name: string }): Promise<User> {
  //   return this.prisma.user.create({ data });
  // }

  // async update(id: number, data: Partial<User>): Promise<User | null> {
  //   return this.prisma.user.update({ where: { id }, data });
  // }

  // async delete(id: number): Promise<User> {
  //   return this.prisma.user.delete({ where: { id } });
  // }
}
