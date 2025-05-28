// usecases/getUserBlogProfile.usecase.ts
import { UserService } from "../domain/users/user.service";
import { PostService } from "../domain/posts/post.service";
import { TYPES } from "../di/types";
import { TagService } from "../domain/tags/tag.service";
type GetUserBlogProfileUseCaseeDependencies = {
  [TYPES.UserService]: UserService;
  [TYPES.PostService]: PostService;
  [TYPES.TagService]: TagService;
};
export class GetUserBlogProfileUseCase {
  private userService: UserService;
  private postService: PostService;
  private tagService: TagService;
  constructor(deps: GetUserBlogProfileUseCaseeDependencies) {
    this.userService = deps[TYPES.UserService] as UserService;
    this.postService = deps[TYPES.PostService] as PostService;
    this.tagService = deps[TYPES.TagService] as TagService;
  }

  async execute(subdomain: string, page: number, tokenUserId?: number) {
    // console.log("GetUserBlogProfileUseCase", subdomain, tokenUserId);
    const user = await this.userService.getBlogProfileBySubdomain(
      subdomain,
      tokenUserId
    );
    // console.log("GetUserBlogProfileUseCase user", user);
    if (!user?.id) {
      throw new Error(`서브도메인 ${subdomain}에 해당하는 유저가 없습니다.`);
    }

    const mine = user?.id === tokenUserId;
    console.log(mine, user, "tokenUserId :: ", tokenUserId);
    const posts = await this.postService.getBlogPostByuserId(
      user.id,
      mine,
      page
    );
    const postLength = await this.postService.getTotalCount(user.id, mine);
    const tagList = await this.tagService.findAllTagsByUserId(user.id, mine);
    return { user, posts, postLength, tagList };
  }
}
