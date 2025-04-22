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
      where: {
        isDeleted: false, // 삭제되지 않은 게시글만 조회
      },
    });
  }

  async findPost(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }
  async updatePost(data: {
    id: number;
    title: string;
    content: string;
    thumbnailUrl: string;
    desc: string;
    visibility: boolean;
    postUrl: string;
  }) {
    const { id, title, content, thumbnailUrl, desc, visibility, postUrl } =
      data;
    console.log("repo" + id);

    return this.prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        thumbnailUrl,
        desc,
        visibility,
        postUrl,
      },
    });
  }
  async deletePost(id: number) {
    return this.prisma.post.update({
      where: { id: Number(id) },
      data: {
        isDeleted: true,
      },
    });
  }
}
