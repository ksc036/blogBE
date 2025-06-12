export type postLike = {
  userId: number;
  postId: number;
};

export type savePlanDto = {
  planName: string;
  repeatDays: number[];
};

export type saveReviewInstance = {
  postId: number;
  planId: number;
};
