// users/user.repository.ts
import { PrismaClient, User } from "@prisma/client";

export class UserRepository {
  // constructor(private readonly prisma = new PrismaClient()) {}
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // async create(data: { name: string }): Promise<User> {
  //   return this.prisma.user.create({ data });
  // }

  // async update(id: number, data: Partial<User>): Promise<User | null> {
  //   return this.prisma.user.update({ where: { id }, data });
  // }

  // async delete(id: number): Promise<User> {
  //   return this.prisma.user.delete({ where: { id } });
  // }
}
