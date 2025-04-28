import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    // JWT가 없으면 로그인 풀린 상태
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // 로그인된 사용자 정보 저장
    next();
  } catch (error) {
    console.error("JWT 인증 실패:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
