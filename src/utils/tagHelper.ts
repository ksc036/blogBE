// src/utils/tagHelper.ts
import { PrismaClient } from "@prisma/client";

export const createInsertTags = (prisma: PrismaClient) => {
  return async (
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
};
export const createDeleteTags = (prisma: PrismaClient) => {
  return async (postId: number, userId: number): Promise<void> => {
    await prisma.postTag.deleteMany({
      where: { postId, userId },
    });
  };
};
