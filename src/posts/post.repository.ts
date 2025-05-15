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
    return await this.prisma.post.create({
      data,
    });
    // const postId = createdPost.id;
    // console.log("postId", postId); // 생성된 ID 출력
    // return postId;
  }
  async isExistPostUrl(userId: string, slug: string): Promise<boolean> {
    const existing = await this.prisma.post.findFirst({
      where: {
        userId,
        postUrl: slug,
      },
      select: { id: true },
    });
    console.log("existing ::", existing);
    return !!existing;
  }

  async findSimilarPostUrls(
    userId: string,
    baseSlug: string
  ): Promise<string[]> {
    return this.prisma.post
      .findMany({
        where: {
          userId,
          postUrl: {
            startsWith: baseSlug + "-",
          },
        },
        select: {
          postUrl: true,
        },
      })
      .then((results) => results.map((r) => r.postUrl));
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
    const post = await this.prisma.post.findUnique({
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
    if (!userId) {
      // 로그인 안 된 사용자 → 무조건 false
      return {
        ...post,
        isSubscribed: false,
      };
    }
    if (!post) return null;

    const follow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: post.user.id,
        },
      },
    });

    return {
      ...post,
      isSubscribed: !!follow,
    };
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
    console.log("getBlogPostByuserId userId : ", userId);
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
  async getPostId(subdomain: string, postUrl: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        postUrl,
        user: {
          subdomain,
        },
      },
      select: {
        id: true,
      },
    });

    return post?.id ?? null; // 없으면 null 반환
  }
}
