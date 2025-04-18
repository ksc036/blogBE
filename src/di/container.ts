import { createContainer, asClass, asValue } from "awilix";
import { TYPES } from "./types";
import prisma from "../prisma/client";
import { UserService } from "../users/user.service";
import { UserRepository } from "../users/user.repository";
import { PostRepository } from "../posts/post.repository";

const container = createContainer();

container.register({
  prisma: asValue(prisma),
  [TYPES.UserService]: asClass(UserService).scoped(),
  [TYPES.UserRepository]: asClass(UserRepository).scoped(),
  // [TYPES.PostService]: asClass(PostService).scoped(),
  [TYPES.PostRepository]: asClass(PostRepository).scoped(),
});

export default container;
