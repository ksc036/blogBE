import { PrismaClient } from "@prisma/client";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { postLike } from "./typs";

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
        createdAt: "desc",
      },
      where: {
        isDeleted: false,
      },
      include: {
        user: true,
        comments: {
          where: { isDeleted: false },
          select: { id: true },
        },
        _count: {
          select: {
            likes: true, // ✅ 좋아요 개수
          },
        },
      },
    });
  }

  async findPost(id: number, userId?: number) {
    return await this.prisma.post.findUnique({
      where: {
        id,
        isDeleted: false, // 삭제되지 않은 게시글만 조회
      },

      include: {
        ...(userId
          ? {
              likes: {
                where: { userId },
                select: { id: true },
              },
            }
          : {}),
        _count: {
          select: {
            likes: true,
          },
        },
        comments: {
          where: {
            // isDeleted: false, // 삭제되지 않은 댓글만 조회
            parentId: null,
          },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: true, // 댓글 작성자 정보도 포함
            replies: {
              where: { isDeleted: false }, // 대댓글도 필터링
              orderBy: {
                createdAt: "asc",
              },
              include: {
                user: true, // 대댓글 작성자도 포함
              },
            },
          },
        },
        user: true,
      },
    });
  }
  async updatePost(data: UpdatePostDTO) {
    const { id, title, content, thumbnailUrl, desc, visibility, postUrl } =
      data;

    return await this.prisma.post.update({
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
    return await this.prisma.post.update({
      where: { id: Number(id) },
      data: {
        isDeleted: true,
      },
    });
  }
  async findAllByUserId(userId: number) {
    return this.prisma.post.findMany({
      where: {
        userId,
        isDeleted: false, // 삭제되지 않은 게시글만 조회
      },
      orderBy: {
        createdAt: "desc", // 생성일 기준 내림차순 정렬
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }
  async getBlogPostByuserId(userId: number) {
    return this.prisma.post.findMany({
      where: {
        userId,
        isDeleted: false, // 삭제되지 않은 게시글만 조회
      },
      orderBy: {
        createdAt: "desc", // 생성일 기준 내림차순 정렬
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
        comments: {
          where: { isDeleted: false },
          select: { id: true },
        },
      },
    });
  }
  async addPostLike(data: postLike) {
    return await this.prisma.postLike.create({
      data,
    });
  }
  async deletePostLike(data: postLike) {
    return await this.prisma.postLike.delete({
      where: {
        userId_postId: {
          userId: data.userId,
          postId: data.postId,
        },
      },
    });
  }
}
