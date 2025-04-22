import { PrismaClient } from "@prisma/client";

export class PostRepository {
  private prisma: PrismaClient;
  constructor({ prisma }: { prisma: any }) {
    this.prisma = prisma;
  }
  async createPost(data: {
    title: string;
    content: string;
    thumbnailUrl: string;
    desc: string;
    visibility: boolean;
    postUrl: string;
  }) {
    return this.prisma.post.create({
      data,
    });
  }

  async findAllPosts() {
    return this.prisma.post.findMany();
  }
}
