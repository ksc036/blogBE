import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { UserService } from "./user.service";
import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  "https://devblogbe.ksc036.store/users/social/google/callback"; // 콜백 URL
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
    const redirectUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&access_type=offline`;

    res.json({ url: redirectUrl });
  },
  googleLogin: async (req: Request, res: Response) => {
    const code = req.query.code;

    try {
      // code를 access token으로 교환
      const { data } = await axios.post(
        "https://oauth2.googleapis.com/token",
        null,
        {
          params: {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
          },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const { access_token, id_token } = data;

      // access_token으로 사용자 정보 가져오기
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      console.log("Google User Info:", userInfo.data);

      // 여기서 세션 생성하거나 JWT 발급
      res.redirect("http://testCompelete.ksc036.store"); // 로그인 후 프론트로 이동
    } catch (error) {
      console.error(error);
      res.status(500).send("구글 로그인 실패");
    }
  },
});
