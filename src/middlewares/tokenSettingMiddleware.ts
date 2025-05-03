import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const tokenSetting = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  console.log("token", token);
  if (token) {
    const decoded = verifyToken(token);
    req.tokenPayload = decoded;
  }
  next();
};
