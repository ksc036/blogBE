// users/user.repository.ts
import { PrismaClient, User } from "@prisma/client";
import { ssoUserInfo } from "./types";

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
  // async update(id: number, data: Partial<User>): Promise<User | null> {
  //   return this.prisma.user.update({ where: { id }, data });
  // }

  // async delete(id: number): Promise<User> {
  //   return this.prisma.user.delete({ where: { id } });
  // }
}
