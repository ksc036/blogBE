// 2. canonical 기준으로 groupBy
import _ from "lodash";

import { PrismaClient } from "@prisma/client";
import { cp } from "fs";
const prisma = new PrismaClient();

async function run() {
  const userId = 2;
  const mine = false;
  const canonicalTagIds: number[] = [1];
  const page = 1;
  const pageSize = 10;

  if (!canonicalTagIds.length) {
    // 전체 글 조회
    const totalCount = await prisma.post.count({
      where: {
        userId,
        isDeleted: false,
        ...(mine ? {} : { visibility: true }),
      },
    });

    const posts = await prisma.post.findMany({
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
  const tagPairs = await prisma.postTag.findMany({
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
  const posts = await prisma.post.findMany({
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
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
