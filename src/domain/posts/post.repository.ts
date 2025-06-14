import { PrismaClient } from "@prisma/client";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { postLike, savePlanDto, saveReviewInstance } from "./typs";
import { createDeleteTags, createInsertTags } from "../../utils/tagHelper";
import { CreatePostSchema } from "./post.model";
import _ from "lodash";
import { ReviewStatus } from "@prisma/client";

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
        ...(userId
          ? {
              reviewInstances: true,
            }
          : {}),
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
  async getBlogPostByTagAnduserId(
    userId: number,
    mine: boolean,
    page: number,
    canonicalTagIds: number[]
  ) {
    const pageSize = 10;

    if (!canonicalTagIds.length) {
      // 전체 글 조회
      const totalCount = await this.prisma.post.count({
        where: {
          userId,
          isDeleted: false,
          ...(mine ? {} : { visibility: true }),
        },
      });

      const posts = await this.prisma.post.findMany({
        where: {
          userId,
          isDeleted: false,
          ...(mine ? {} : { visibility: true }),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          postTags: {
            include: {
              tag: true,
            },
          },
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
      console.log(
        "canonicalTagIds 0 :::::posts",
        posts,
        "totalCount",
        totalCount
      );
      return { posts, totalCount };
    }

    // 1. 중복 포함된 태그 - canonicalTagId 기준으로 조회
    const tagPairs = await this.prisma.postTag.findMany({
      where: {
        userId,
        tag: {
          canonicalTagId: {
            in: canonicalTagIds,
          },
        },
        post: {
          isDeleted: false,
          ...(mine ? {} : { visibility: true }),
        },
      },
      select: {
        postId: true,
        tag: {
          select: {
            canonicalTagId: true,
          },
        },
      },
    });

    // 2. postId 기준으로 canonicalTagId 집합 구성
    const grouped = _.groupBy(tagPairs, (item) => item.postId);
    const filteredPostIds = Object.entries(grouped)
      .filter(([_, items]) => {
        const canonicals = new Set(items.map((i) => i.tag.canonicalTagId));
        return canonicalTagIds.every((id) => canonicals.has(id));
      })
      .map(([postId]) => Number(postId));

    const totalCount = filteredPostIds.length;

    // 3. 게시글 조회
    const posts = await this.prisma.post.findMany({
      where: {
        id: { in: filteredPostIds },
        userId,
        isDeleted: false,
        ...(mine ? {} : { visibility: true }),
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        postTags: { include: { tag: true } },
        _count: { select: { likes: true } },
        comments: {
          where: { isDeleted: false },
          select: { id: true },
        },
      },
    });

    console.log("canonicalTagIds 1 :::::posts", posts);
    console.log("totalCount :::::::::", totalCount);
    return { posts, totalCount };
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
  async getReviewPosts(userId: number) {
    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const kstStartOfDay = new Date(
      kstNow.getFullYear(),
      kstNow.getMonth(),
      kstNow.getDate(),
      0,
      0,
      0
    );
    const kstEndOfDay = new Date(
      kstNow.getFullYear(),
      kstNow.getMonth(),
      kstNow.getDate(),
      23,
      59,
      59,
      999
    );
    const utcStart = new Date(kstStartOfDay.getTime() - 9 * 60 * 60 * 1000);
    const utcEnd = new Date(kstEndOfDay.getTime() - 9 * 60 * 60 * 1000);

    return await this.prisma.reviewInstance.findMany({
      where: {
        scheduledDate: {
          gte: utcStart,
          lte: utcEnd,
        },
        userId: userId,
        status: ReviewStatus.PENDING,
      },
      include: {
        post: true,
      },
    });
  }
  async getAllReviewInstanceWithPost(userId: number) {
    return await this.prisma.reviewInstance.findMany({
      where: {
        userId: userId,
      },
      include: {
        post: true, // Post 데이터 포함
      },
    });
  }
  async getUserPlanList(userId: number) {
    return await this.prisma.reviewPlan.findMany({
      where: {
        userId: userId,
      },
    });
  }
  async saveReviewPlan(userId: number, dataDto: savePlanDto) {
    return await this.prisma.reviewPlan.create({
      data: {
        userId: userId,
        reviewDays: dataDto.repeatDays,
        name: dataDto.planName,
      },
    });
  }
  async saveReviewInstance(userId: number, dataDto: saveReviewInstance) {
    const reviewPlan = await this.prisma.reviewPlan.findUnique({
      where: { id: dataDto.planId },
    });
    console.log("reviewPlan :::", reviewPlan);
    // if (!reviewPlan) {
    //   return res.status(404).json({ message: "ReviewPlan을 찾을 수 없습니다." });
    // }

    const reviewDays: number[] = reviewPlan?.reviewDays as number[];
    const today = new Date();

    // 2️⃣ 각 day 만큼 더한 scheduledDate로 instance 생성
    const instancesToCreate = reviewDays.map((day) => {
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + day);

      return {
        reviewPlanId: dataDto.planId,
        postId: dataDto.postId,
        userId: userId,
        scheduledDate: scheduledDate,
        status: ReviewStatus.PENDING,
      };
    });

    // 3️⃣ createMany 사용 (트랜잭션 아님) 또는 Promise.all(create)
    await this.prisma.reviewInstance.createMany({
      data: instancesToCreate,
    });
  }
  async reviewSuccess(userId: number, reviewInstanceId: number) {
    return await this.prisma.reviewInstance.update({
      where: {
        id: reviewInstanceId,
        userId,
      },
      data: {
        status: ReviewStatus.DONE,
        reviewedAt: new Date(),
      },
    });
  }
}
