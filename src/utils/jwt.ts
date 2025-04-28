import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15d" }); // 7일짜리 토큰 발급
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
