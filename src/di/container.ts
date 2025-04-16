import { createContainer, asClass, asValue } from "awilix";
import { TYPES } from "./types";
import prisma from "../prisma/client.js";
import { UserService } from "../users/user.service";
import { UserRepository } from "../users/user.repository";

const container = createContainer();

container.register({
  prisma: asValue(prisma),
  [TYPES.UserService]: asClass(UserService).scoped(),
  [TYPES.UserRepository]: asClass(UserRepository).scoped(),
});

export default container;
