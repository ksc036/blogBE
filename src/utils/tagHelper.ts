// src/utils/tagHelper.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const insertTags = async (
  tags: string[],
  postId: number,
  userId: number
): Promise<void> => {
  for (const name of tags) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.postTag.upsert({
      where: {
        userId_postId_tagId: {
          userId,
          postId,
          tagId: tag.id,
        },
      },
      update: {},
      create: {
        userId,
        postId,
        tagId: tag.id,
      },
    });
  }
};
