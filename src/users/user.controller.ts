import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { UserService } from "./user.service";
import axios from "axios";
import { generateToken, verifyToken } from "../utils/jwt";
import { DbUserInfo, SsoUserInfo } from "./types";

export const userController = ({
  [TYPES.UserService]: userService,
}: {
  [TYPES.UserService]: UserService;
}) => ({
  getUsers: async (req: Request, res: Response) => {
    console.log("getUsers called");
    const users = await userService.getAll();
    res.json(users);
  },
  googleLoginInit: async (req: Request, res: Response) => {
    if (!process.env.GOOGLE_REDIRECT_URI || !process.env.GOOGLE_CLIENT_ID) {
      return res
        .status(500)
        .send("Google environment variables is not set in server.");
    }
    const redirectUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&access_type=offline`;

    res.json({ url: redirectUrl });
  },

  googleCallback: async (req: Request, res: Response) => {
    const code = req.query.code;

    try {
      const SsoUserInfo: SsoUserInfo = await userService.getGoogleUserInfo(
        code as string
      );
      const dbUserInfo: DbUserInfo = await userService.saveUserInfo(
        SsoUserInfo
      );

      console.log("Google User Info:", SsoUserInfo);
      const token = generateToken({
        id: dbUserInfo.id,
        email: dbUserInfo.email,
        name: dbUserInfo.name,
      });

      // 여기서 세션 생성하거나 JWT 발급
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        domain: ".ksc036.store",
        path: "/",
      }); // 쿠키에 JWT 저장
      res.redirect(`http://${dbUserInfo.subdomain}.ksc036.store`); // 로그인 후 프론트로 이동
    } catch (error) {
      console.error(error);
      res.status(500).send("구글 로그인 실패");
    }
  },
  getMe: async (req: Request, res: Response) => {
    const token = req.cookies.token; // 쿠키에서 JWT 가져오기
    console.log(verifyToken(token));
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    console.log("getMe called", token);
    res.json({ status: "ok" });
    // try {
    //   const userInfo = await userService.getUserInfo(token);
    //   res.json(userInfo);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).send("Failed to get user info");
    // }
  },
});
