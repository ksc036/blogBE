import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
  thumbnailUrl: z.string(),
  desc: z.string(),
  visibility: z.boolean(),
  postUrl: z.string(),
  userId: z.number().optional(), // optional이면 그대로 유지
});
