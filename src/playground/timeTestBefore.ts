// 실행 명령어 npx ts-node  src/playground/timeTest.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  const now = new Date();
  console.log(now);
  // const koreaMidnight = new Date(
  //   new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  // );
  // koreaMidnight.setHours(0, 0, 0, 0);

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

  // console.log("✅ 모든 태그의 canonical 연결 완료");
  process.exit();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
