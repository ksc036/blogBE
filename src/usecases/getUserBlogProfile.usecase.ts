// usecases/getUserBlogProfile.usecase.ts
import { UserService } from "../users/user.service";
import { PostService } from "../posts/post.service";
import { TYPES } from "../di/types";
type GetUserBlogProfileUseCaseeDependencies = {
  [TYPES.UserService]: UserService;
  [TYPES.PostService]: PostService;
};
export class GetUserBlogProfileUseCase {
  private userService: UserService;
  private postService: PostService;
  constructor(deps: GetUserBlogProfileUseCaseeDependencies) {
    this.userService = deps[TYPES.UserService] as UserService;
    this.postService = deps[TYPES.PostService] as PostService;
  }

  async execute(subdomain: string, userId?: number) {
    console.log("GetUserBlogProfileUseCase", subdomain, userId);
    const user = await this.userService.getBlogProfileBySubdomain(
      subdomain,
      userId
    );
    console.log("GetUserBlogProfileUseCase user", user);
    if (!user?.id) {
      throw new Error(`서브도메인 ${subdomain}에 해당하는 유저가 없습니다.`);
    }
    const posts = await this.postService.getBlogPostByuserId(user.id);
    return { user, posts };
  }
}
