// 실행 명령어 npx ts-node  src/playground/timeTest.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  const now = new Date();
  const nowKST = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstYear = nowKST.getFullYear();
  const kstMonth = nowKST.getMonth();
  const kstDate = nowKST.getDate();

  const kstMidnightUTC = new Date(
    Date.UTC(kstYear, kstMonth, kstDate, 0, 0, 0) - 9 * 60 * 60 * 1000
  );
  console.log("정확한 KST 자정(UTC 기준):", kstMidnightUTC.toISOString());
  // const result = await prisma.reviewInstance.updateMany({
  //   where: {
  //     status: "PENDING",
  //     scheduledDate: {
  //       lt: koreaMidnight,
  //     },
  //   },
  //   data: {
  //     status: "MISSED",
  //   },
  // });

  // console.log(`[Cron] ${result.count}개 리뷰가 'MISSED'로 업데이트됨`);

  console.log("✅ 모든 태그의 canonical 연결 완료");
  process.exit();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
