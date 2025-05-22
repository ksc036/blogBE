import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { UserService } from "./user.service";
import { generateToken, verifyToken } from "../utils/jwt";
import {
  dbUserInfo,
  followUserDto,
  ssoUserInfo,
  tokenPayload,
  updateUserDto,
} from "./types";
import { GetUserBlogProfileUseCase } from "../usecases/getUserBlogProfile.usecase";
import { User } from "@prisma/client";
type userControllerDependencies = {
  [TYPES.UserService]: UserService;
  [TYPES.GetUserBlogProfileUseCase]: GetUserBlogProfileUseCase;
};
export const userController = (deps: userControllerDependencies) => {
  const userService = deps[TYPES.UserService] as UserService;
  const getUserBlogProfileUseCase = deps[
    TYPES.GetUserBlogProfileUseCase
  ] as GetUserBlogProfileUseCase;
  return {
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
        const SsoUserInfo: ssoUserInfo = await userService.getGoogleUserInfo(
          code as string
        );
        const dbUserInfo: User = await userService.saveUserInfo(SsoUserInfo);

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
          sameSite: "none", // cross-site 허용
          domain: `.${process.env.DOMAIN_NAME}`,
          path: "/",
          maxAge: 15 * 1000 * 60 * 60 * 24,
        }); // 쿠키에 JWT 저장
        res.redirect(
          `http://${dbUserInfo.subdomain}.${process.env.DOMAIN_NAME}`
        ); // 로그인 후 프론트로 이동
      } catch (error) {
        console.error(error);
        res.status(500).send("구글 로그인 실패");
      }
    },
    getMe: async (req: Request, res: Response) => {
      const token = req.cookies.token; // 쿠키에서 JWT 가져오기
      const payload = verifyToken(token); // JWT 검증
      if (!token) {
        return res.status(401).send("Unauthorized");
      }
      console.log("getMe called", token);
      // res.json({ status: "ok" });
      try {
        const userInfo = await userService.getUserInfoById((payload as any).id);
        res.json(userInfo);
      } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get user info");
      }
    },
    logout: async (req: Request, res: Response) => {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        domain: `.${process.env.DOMAIN_NAME}`,
        path: "/",
      });
      res.status(200).send("Logout success");
    },
    updateUser: async (req: Request, res: Response) => {
      const { field, value } = req.body;
      console.log("updateUser called", field, value);
      const allowedFields = [
        "name",
        "email",
        "subdomain",
        "bio",
        "blogName",
        "thumbnailUrl",
      ];
      if (!allowedFields.includes(field)) {
        return res.status(400).json({ error: "Invalid field" });
      }
      console.log("end");
      const user = await userService.updateUser({
        userId: (req.tokenPayload as any).id,
        field,
        value,
      } as updateUserDto);
      return res.status(200).json({ user });
    },
    blogProfileBySubdomain: async (req: Request, res: Response) => {
      const { subdomain } = req.params;
      console.log("blogProfileBySubdomain token Payload", req.tokenPayload);
      const tokenUserId = (req.tokenPayload as any)?.id ?? undefined;
      console.log("tokenUserId", tokenUserId);
      console.log("subdomain", subdomain);
      const result = await getUserBlogProfileUseCase.execute(
        subdomain,
        tokenUserId
      );
      res.json(result);
    },
    followUser: async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = (req.tokenPayload as any).id;
      // const userId = 2;
      const data: followUserDto = { myId: userId, userId: Number(id) };
      const result = await userService.followUser(data);
      res.json(result);
    },
    unfollowUser: async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = (req.tokenPayload as any).id;
      // const userId = 2;
      const data: followUserDto = { myId: userId, userId: Number(id) };
      const result = await userService.unfollowUser(data);
      res.json(result);
    },
    getFollowings: async (req: Request, res: Response) => {
      const { id } = req.params;
      console.log(id);
      const userId = (req.tokenPayload as any).id;
      const data: followUserDto = { myId: userId, userId: Number(id) };
      const result = await userService.followUser(data);
      res.json(result);
    },
    getFollowers: async (req: Request, res: Response) => {
      const { id } = req.params;
      console.log(id);
      const userId = (req.tokenPayload as any).id;
      const data = { myId: userId, userId: Number(id) };
      const result = await userService.followUser(data);
      res.json(result);
    },
  };
};
