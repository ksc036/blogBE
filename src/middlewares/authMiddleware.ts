import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  console.log("authenticate", token);
  if (!token) {
    // next(error);
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = verifyToken(token);
    (req.tokenPayload as any) = decoded;
    next();
  } catch (error) {
    console.error("JWT 인증 실패:", error);
    next(error);
  }
};
