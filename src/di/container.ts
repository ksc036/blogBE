import { createContainer, asClass, asValue } from "awilix";
import { TYPES } from "./types";
import prisma from "../prisma/client";
import { UserService } from "../domain/users/user.service";
import { UserRepository } from "../domain/users/user.repository";
import { PostRepository } from "../domain/posts/post.repository";
import { PostService } from "../domain/posts/post.service";
import { CommentService } from "../domain/comments/comment.service";
import { CommentRepository } from "../domain/comments/comment.repository";
import { TagService } from "../domain/tags/tag.service";
import { TagRepository } from "../domain/tags/tag.repository";
// usecases
import { GetUserBlogProfileUseCase } from "../usecases/getUserBlogProfile.usecase";
import { PostTagUseCase } from "../usecases/postTag.usecase";
import { GetUserBlogPostsByTagUseCase } from "../usecases/getUserBlogPostsByTags.usecase";

const container = createContainer();

container.register({
  prisma: asValue(prisma),
  [TYPES.UserService]: asClass(UserService).scoped(),
  [TYPES.UserRepository]: asClass(UserRepository).scoped(),
  [TYPES.PostService]: asClass(PostService).scoped(),
  [TYPES.PostRepository]: asClass(PostRepository).scoped(),
  [TYPES.CommentService]: asClass(CommentService).scoped(),
  [TYPES.CommentRepository]: asClass(CommentRepository).scoped(),
  [TYPES.TagService]: asClass(TagService).scoped(),
  [TYPES.TagRepository]: asClass(TagRepository).scoped(),
  // UseCases
  [TYPES.GetUserBlogProfileUseCase]: asClass(
    GetUserBlogProfileUseCase
  ).scoped(),
  [TYPES.PostTagUseCase]: asClass(PostTagUseCase).scoped(),
  [TYPES.GetUserBlogPostsByTagsUseCase]: asClass(
    GetUserBlogPostsByTagUseCase
  ).scoped(), // Assuming this is the correct use case
});

export default container;
