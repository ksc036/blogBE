import express, { Request, Response } from "express";
import { scopePerRequest } from "awilix-express";
import container from "./di/container";
import userRouter from "./routes/user.route";
import cors from "cors";
import dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.S3_URL!, // ✅ MinIO 주소
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // ✅ 이게 핵심!
});
app.get("/", async (req: Request, res: Response) => {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: "delog" }));
    console.log("✅ 버킷 있음");
  } catch (err) {
    console.log("❌ 버킷 없음", err);
  }
  res.json({ message: "application contact" });
});
// Presigned URL 발급 API
app.post("/presign", async (req: Request, res: Response) => {
  console.log("body : ", req.body);
  const { filename } = req.body as { filename?: string };

  if (!filename) {
    return res.status(400).json({ error: "filename is required" });
  }

  const key = `uploads/${Date.now()}_${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.json({ url });
  } catch (err) {
    console.error("Presign Error:", err);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});
app.use(scopePerRequest(container));
app.use("/users", userRouter);
// app.use("/posts", postRouter);
export default app;
