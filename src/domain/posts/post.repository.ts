import { PrismaClient } from "@prisma/client";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { postLike } from "./typs";
import { createDeleteTags, createInsertTags } from "../../utils/tagHelper";
import { CreatePostSchema } from "./post.model";

export class PostRepository {
  private prisma: PrismaClient;
  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }

  async createPost(data: CreatePostDTO) {
    const model = CreatePostSchema.safeParse(data);
    if (!model.success) {
      throw new Error("유효하지 않은 게시글 데이터입니다.");
    }
    return await this.prisma.post.create({
      data: model.data,
    });
    // console.log("post created", post);
    // const insertTags = createInsertTags(this.prisma);
    // if (data.tags && data.tags.length > 0 && data.userId) {
    //   await insertTags(data.tags, post.id, data.userId);
    // }
    // return post;
  }
  async isExistPostUrl(userId: number, slug: string): Promise<boolean> {
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
    userId: number,
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
  async findAllPosts(page: number) {
    const pageSize = 20;

    const [posts, totalPostLength] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
          isDeleted: false,
          visibility: true,
        },
        include: {
          user: true,
          comments: {
            where: { isDeleted: false },
            select: { id: true },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
      this.prisma.post.count({
        where: {
          isDeleted: false,
          visibility: true,
        },
      }),
    ]);

    return { posts, totalPostLength };
  }

  async findPost(id: number, userId?: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
        isDeleted: false, // 삭제되지 않은 게시글만 조회
      },

      include: {
        postTags: {
          include: {
            tag: true, // ← tag를 postTags에서 조인
          },
        },
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
    const post = await this.prisma.post.update({
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
    // const deleteTags = createDeleteTags(this.prisma);
    // await deleteTags(post.id, data.userId);
    // const insertTags = createInsertTags(this.prisma);
    // if (data.tags && data.tags.length > 0) {
    //   await insertTags(data.tags, post.id, data.userId);
    // }
    return post;
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
  async getBlogPostByuserId(userId: number, mine: boolean, page: number) {
    console.log("getBlogPostByuserId userId : ", userId);
    return this.prisma.post.findMany({
      where: {
        userId,
        isDeleted: false, // 삭제되지 않은 게시글만 조회
        ...(mine ? {} : { visibility: true }),
      },
      orderBy: {
        createdAt: "desc", // 생성일 기준 내림차순 정렬
      },
      skip: (page - 1) * 10,
      take: 10,
      include: {
        postTags: {
          include: {
            tag: true, // ← tag를 postTags에서 조인
          },
        },
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
  async getTotalCount(userId: number, mine: boolean) {
    return await this.prisma.post.count({
      where: {
        userId,
        isDeleted: false,
        ...(mine ? {} : { visibility: true }),
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
