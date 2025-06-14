import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function registerReviewStatusCron() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      const koreaMidnight = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      );
      koreaMidnight.setHours(0, 0, 0, 0);

      const result = await prisma.reviewInstance.updateMany({
        where: {
          status: "PENDING",
          scheduledDate: {
            lt: koreaMidnight,
          },
        },
        data: {
          status: "MISSED",
        },
      });

      console.log(`[Cron] ${result.count}개 리뷰가 'MISSED'로 업데이트됨`);
    },
    {
      timezone: "Asia/Seoul",
    }
  );
}
