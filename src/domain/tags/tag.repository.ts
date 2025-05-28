// users/user.repository.ts
import { PrismaClient, User } from "@prisma/client";
import { normalize } from "../../utils/tagHelper";

export class TagRepository {
  private prisma: PrismaClient;
  // constructor(private readonly prisma = new PrismaClient()) {}
  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }

  async insertTags(tags: string[], postId: number, userId: number) {
    for (const name of tags) {
      const normalized = normalize(name); // 소문자 변환 + 공백 제거 등

      // 1. canonicalTag upsert
      const canonical = await this.prisma.canonicalTag.upsert({
        where: { normalizedName: normalized },
        update: {},
        create: { normalizedName: normalized },
      });

      // 2. tag upsert
      const tag = await this.prisma.tag.upsert({
        where: { name }, // 사용자가 입력한 그대로
        update: {},
        create: {
          name,
          canonicalTagId: canonical.id,
        },
      });

      // 3. postTag upsert
      await this.prisma.postTag.upsert({
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
          // canonicalTagId: canonical.id, // 💡 이걸 PostTag에 저장하도록 모델에 포함했을 경우
        },
      });
    }
  }

  async deleteTag(postId: number, userId: number) {
    return await this.prisma.postTag.deleteMany({
      where: { postId, userId },
    });
  }
  async findAllTagsByUserId(userId: number, mine: boolean) {
    return await this.prisma.postTag.findMany({
      where: {
        userId,
        post: mine
          ? undefined
          : {
              visibility: true,
            },
      },
      include: {
        tag: {
          include: {
            canonical: true,
          },
        },
      },
    });
  }
}
