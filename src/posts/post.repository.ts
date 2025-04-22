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
    console.log("postId", postId); // 생성된 ID 출력
    return postId;
  }

  async findAllPosts() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // 생성일 기준 내림차순 정렬
      },
    });
  }

  async findPost(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }
}
