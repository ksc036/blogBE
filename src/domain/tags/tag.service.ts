import { TagRepository } from "./tag.repository";
import { TYPES } from "../../di/types";

type TagServiceDependencies = {
  [TYPES.TagRepository]: TagRepository;
};
export class TagService {
  private tagRepository: TagRepository;

  constructor(deps: TagServiceDependencies) {
    this.tagRepository = deps[TYPES.TagRepository] as TagRepository;
  }

  async insertTags(tags: string[], postId: number, userId: number) {
    return await this.tagRepository.insertTags(tags, postId, userId);
  }
  async deleteTag(postId: number, userId: number) {
    return await this.tagRepository.deleteTag(postId, userId);
  }
}
