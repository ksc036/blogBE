import { registerReviewStatusCron } from "./review-status-updater";

export function startAllCrons() {
  registerReviewStatusCron();
  // 나중에 다른 크론 추가 가능
  // registerEmailDigestCron();
}
