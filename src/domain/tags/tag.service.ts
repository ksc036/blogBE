import { TagRepository } from "./tag.repository";
import { TYPES } from "../../di/types";
import _ from "lodash";

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
  async findAllTagsByUserId(userId: number, mine: boolean) {
    const postTags = await this.tagRepository.findAllTagsByUserId(userId, mine);
    const uniquePairs: {
      canonical: string;
      canonicalId: number | null;
      postId: number;
      name: string;
    }[] = [];

    for (const pt of postTags) {
      const canonical = pt.tag.canonical?.normalizedName ?? pt.tag.name;
      uniquePairs.push({
        canonical,
        postId: pt.postId,
        name: pt.tag.name,
        canonicalId: pt.tag.canonical?.id ?? null,
      });
    }

    const grouped = _.groupBy(uniquePairs, (p) => p.canonical);

    const result = Object.entries(grouped).map(([canonical, items]) => {
      const nameToPostIdSet = new Map<string, Set<number>>();

      for (const item of items) {
        const set = nameToPostIdSet.get(item.name) ?? new Set<number>();
        set.add(item.postId);
        nameToPostIdSet.set(item.name, set);
      }

      let topName = "";
      let maxPostCount = 0;
      let countSet = new Set<number>();

      for (const [name, set] of nameToPostIdSet.entries()) {
        countSet = new Set([...countSet, ...set]);
        if (set.size > maxPostCount) {
          topName = name;
          maxPostCount = set.size;
        }
      }
      const canonicalId = items[0].canonicalId;
      return {
        canonical,
        count: countSet.size, // 실제로 중복 제거된 post 수
        topName, // 가장 많이 사용된 원본 태그명
        canonicalId,
      };
    });
    return result;
  }
}
