// users/user.repository.ts
import { PrismaClient, User } from "@prisma/client";
import { ssoUserInfo, updateUserDto } from "./types";

export class UserRepository {
  private prisma: PrismaClient;
  // constructor(private readonly prisma = new PrismaClient()) {}
  constructor({ prisma }: { prisma: PrismaClient }) {
    this.prisma = prisma;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(data: ssoUserInfo): Promise<User> {
    return this.prisma.user.create({ data });
  }
  async findIdBySubdomain(subdomain: string): Promise<number | null> {
    const user = await this.prisma.user.findUnique({
      where: { subdomain },
    });
    return user ? user.id : null;
  }

  async updateUserInfo(data: updateUserDto): Promise<User> {
    const { userId, field, value } = data;
    console.log("updateUserInfo called", data);
    return await this.prisma.user.update({
      where: { id: userId }, // 인증된 사용자 ID 사용
      data: { [field]: value }, // 동적 키 업데이트
    });
  }
  // async update(id: number, data: Partial<User>): Promise<User | null> {
  //   return this.prisma.user.update({ where: { id }, data });
  // }

  // async delete(id: number): Promise<User> {
  //   return this.prisma.user.delete({ where: { id } });
  // }
}
