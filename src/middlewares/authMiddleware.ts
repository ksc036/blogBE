import { NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
interface AuthenticatedRequest extends Request {
  cookies: {
    token?: string;
    [key: string]: any;
  };
  user?: any; // 나중에 req.user 도 확장
}
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    // next(error);
    next(new Error("Unauthorized"));
    console.log("인증 실패: 토큰이 없습니다.");
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT 인증 실패:", error);
    next(error);
  }
};
