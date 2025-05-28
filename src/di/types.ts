export const TYPES = {
  UserService: Symbol.for("UserService"),
  UserRepository: Symbol.for("UserRepository"),
  PostService: Symbol.for("PostService"),
  PostRepository: Symbol.for("PostRepository"),
  CommentService: Symbol.for("CommentService"),
  CommentRepository: Symbol.for("CommentRepository"),
  TagService: Symbol.for("TagService"),
  TagRepository: Symbol.for("TagRepository"),
  // ✅ 추가된 UseCase
  GetUserBlogProfileUseCase: Symbol.for("GetUserBlogProfileUseCase"),
  PostTagUseCase: Symbol.for("PostTagUseCase"),
  GetUserBlogPostsByTagsUseCase: Symbol.for("getUserBlogPostsByTagsUseCase"),
};
