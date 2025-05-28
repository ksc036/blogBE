import { TagService } from "../domain/tags/tag.service";
import { PostService } from "../domain/posts/post.service";
import { TYPES } from "../di/types";
import { CreatePostDTO, UpdatePostDTO } from "../domain/posts/post.dto";
type PostTagUseCaseDependencies = {
  [TYPES.TagService]: TagService;
  [TYPES.PostService]: PostService;
};

export class PostTagUseCase {
  private tagService: TagService;
  private postService: PostService;
  constructor(deps: PostTagUseCaseDependencies) {
    this.tagService = deps[TYPES.TagService] as TagService;
    this.postService = deps[TYPES.PostService] as PostService;
  }

  async create(data: CreatePostDTO) {
    const post = await this.postService.createPost(data);
    if (data.tags && data.tags.length > 0 && data.userId) {
      await this.tagService.insertTags(data.tags, post.id, data.userId);
    }
    return this.postService.createPost(data);
  }
  async update(data: UpdatePostDTO) {
    const post = await this.postService.updatePost(data);
    this.tagService.deleteTag(post.id, data.userId);
    if (data.tags && data.tags.length > 0 && data.userId) {
      await this.tagService.insertTags(data.tags, post.id, data.userId);
    }
    return post;
  }
}
