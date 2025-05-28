// usecases/getUserBlogProfile.usecase.ts
import { PostService } from "../domain/posts/post.service";
import { TYPES } from "../di/types";

type GetUserBlogPostsByTagUseCaseDependencies = {
  [TYPES.PostService]: PostService;
};
export class GetUserBlogPostsByTagUseCase {
  private postService: PostService;
  constructor(deps: GetUserBlogPostsByTagUseCaseDependencies) {
    this.postService = deps[TYPES.PostService] as PostService;
  }

  async execute(
    userId: number,
    tokenUserId?: number,
    page: number = 1,
    tagIds: number[] = []
  ) {
    console.log(
      "userId, tokenUserId, page, tagIds",
      userId,
      tokenUserId,
      page,
      tagIds
    );
    const mine = userId === tokenUserId;
    console.log(mine, userId, "tokenUserId :: ", tokenUserId);
    const data = await this.postService.getBlogPostByTagAnduserId(
      userId,
      mine,
      page,
      tagIds
    );
    return data;
  }
}
