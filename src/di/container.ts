import { createContainer, asClass, asValue } from "awilix";
import { TYPES } from "./types";
import prisma from "../prisma/client";
import { UserService } from "../users/user.service";
import { UserRepository } from "../users/user.repository";
import { PostRepository } from "../posts/post.repository";
import { PostService } from "../posts/post.service";
import { CommentService } from "../comments/comment.service";
import { CommentRepository } from "../comments/comment.repository";
// usecases
import { GetUserBlogProfileUseCase } from "../usecases/getUserBlogProfile.usecase";

const container = createContainer();

container.register({
  prisma: asValue(prisma),
  [TYPES.UserService]: asClass(UserService).scoped(),
  [TYPES.UserRepository]: asClass(UserRepository).scoped(),
  [TYPES.PostService]: asClass(PostService).scoped(),
  [TYPES.PostRepository]: asClass(PostRepository).scoped(),
  [TYPES.CommentService]: asClass(CommentService).scoped(),
  [TYPES.CommentRepository]: asClass(CommentRepository).scoped(),

  // UseCases
  [TYPES.GetUserBlogProfileUseCase]: asClass(
    GetUserBlogProfileUseCase
  ).scoped(),
});

export default container;
