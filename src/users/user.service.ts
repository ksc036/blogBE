import axios from "axios";
import { TYPES } from "../di/types";
import { UserRepository } from "./user.repository";
import { dbUserInfo, followUserDto, ssoUserInfo, updateUserDto } from "./types";
import { User } from "@prisma/client";
export class UserService {
  private userRepository: UserRepository;
  constructor({
    [TYPES.UserRepository]: userRepository,
  }: {
    [TYPES.UserRepository]: UserRepository;
  }) {
    this.userRepository = userRepository;
  }

  async getAll() {
    return this.userRepository.findAll();
  }
  async getGoogleUserInfo(code: string) {
    // code를 access token으로 교환
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, id_token } = data;

    console.log("access_token", id_token);
    // access_token으로 사용자 정보 가져오기
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    userInfo.data.provider = "google";

    return userInfo.data;
  }
  async saveUserInfo(userInfo: ssoUserInfo): Promise<User> {
    const { sub, email, name, provider } = userInfo;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const subdomain = email.split("@")[0];
      return await this.userRepository.create({
        sub,
        email,
        name,
        provider,
        subdomain,
      });
    }
    return user;
  }
  async getUserInfoById(id: number) {
    const userInfo = await this.userRepository.findById(id);
    return userInfo;
  }
  async getUserIdBySubdomain(subdomain: string) {
    return await this.userRepository.findIdBySubdomain(subdomain);
  }
  async getBlogProfileBySubdomain(subdomain: string, userId?: number) {
    return await this.userRepository.getUserInfoBySubdomain(subdomain, userId);
  }
  async updateUser(data: updateUserDto) {
    return await this.userRepository.updateUserInfo(data);
  }
  async followUser(data: followUserDto) {
    return await this.userRepository.followUser(data);
  }
  async unfollowUser(data: followUserDto) {
    return await this.userRepository.unfollowUser(data);
  }
}
