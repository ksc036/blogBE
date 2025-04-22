import { PrismaClient } from "@prisma/client";

export class PostRepository {
  private prisma: PrismaClient;
  constructor({ prisma }: { prisma: PrismaClient }) {
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
    // 자동 생성된 ID 가져오기
    const createdPost = await this.prisma.post.create({
      data,
    });
    const postId = createdPost.id;
    return postId;
  }

  async findAllPosts() {
    return this.prisma.post.findMany();
  }

  async findPost(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }
}
