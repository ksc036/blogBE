// 2. canonical 기준으로 groupBy
import _ from "lodash";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function normalize(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function run() {
  const tags = await prisma.tag.findMany({ where: { canonicalTagId: null } });

  for (const tag of tags) {
    const normalized = normalize(tag.name);

    let canonical = await prisma.canonicalTag.findUnique({
      where: { normalizedName: normalized },
    });

    if (!canonical) {
      canonical = await prisma.canonicalTag.create({
        data: { normalizedName: normalized },
      });
    }

    await prisma.tag.update({
      where: { id: tag.id },
      data: { canonicalTagId: canonical.id },
    });
  }

  console.log("✅ 모든 태그의 canonical 연결 완료");
  process.exit();
}
// async function run() {
//   const userId = 2;
//   const mine: boolean = true;
//   const postTags = await prisma.postTag.findMany({
//     where: {
//       userId,
//       post: mine
//         ? undefined
//         : {
//             visibility: true,
//           },
//     },
//     include: {
//       tag: {
//         include: {
//           canonical: true,
//         },
//       },
//     },
//   });

//   const uniquePairs: {
//     canonical: string;
//     canonicalId: number | null;
//     postId: number;
//     name: string;
//   }[] = [];

//   for (const pt of postTags) {
//     const canonical = pt.tag.canonical?.normalizedName ?? pt.tag.name;
//     uniquePairs.push({
//       canonical,
//       postId: pt.postId,
//       name: pt.tag.name,
//       canonicalId: pt.tag.canonical?.id ?? null,
//     });
//   }

//   const grouped = _.groupBy(uniquePairs, (p) => p.canonical);

//   const result = Object.entries(grouped).map(([canonical, items]) => {
//     const nameToPostIdSet = new Map<string, Set<number>>();

//     for (const item of items) {
//       const set = nameToPostIdSet.get(item.name) ?? new Set<number>();
//       set.add(item.postId);
//       nameToPostIdSet.set(item.name, set);
//     }

//     let topName = "";
//     let maxPostCount = 0;
//     let countSet = new Set<number>();

//     for (const [name, set] of nameToPostIdSet.entries()) {
//       countSet = new Set([...countSet, ...set]);
//       if (set.size > maxPostCount) {
//         topName = name;
//         maxPostCount = set.size;
//       }
//     }
//     const canonicalId = items[0].canonicalId;
//     return {
//       canonical,
//       count: countSet.size, // 실제로 중복 제거된 post 수
//       topName, // 가장 많이 사용된 원본 태그명
//       canonicalId,
//     };
//   });
//   console.log("결과:", result);
//   return result;
// }
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
