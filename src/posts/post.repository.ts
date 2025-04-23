import { PrismaClient } from "@prisma/client";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";

export class PostRepository {
  private prisma: PrismaClient;
  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }
  async createPost(data: CreatePostDTO) {
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
      include: {
        comments: {
          include: {
            user: true, // 댓글 작성자 정보도 포함
            replies: {
              include: {
                user: true, // 대댓글 작성자도 포함
              },
            },
          },
        },
      },
    });
  }
  async updatePost(data: UpdatePostDTO) {
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
