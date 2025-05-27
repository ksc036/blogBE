import express, { Router, Request, Response } from "express";
import { makeInvoker } from "awilix-express";
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../s3/s3Client";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  const host = req.headers.host;
  const subdomain = host?.split(".")[0];
  console.log("서브도메인:", subdomain);
  res.json({ message: "application contact" });
});

// Presigned URL 발급 API
router.post(
  "/presign",
  authenticate,
  async (req: Request, res: Response): Promise<any> => {
    const userId = (req.tokenPayload as any)?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { filename } = req.body as { filename?: string };

    if (!filename) {
      return res.status(400).json({ error: "filename is required" });
    }

    const key = `${userId}/${Date.now()}_${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });

    try {
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      console.log("Presigned URL:", url);
      const { pathname, search } = new URL(url);
      const pathAndQuery = pathname + search;
      res.json({ url: pathAndQuery });
    } catch (err) {
      console.error("Presign Error:", err);
      res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  }
);

export default router;
