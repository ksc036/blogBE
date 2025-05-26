import { PostRepository } from "./post.repository";
import { TYPES } from "../di/types";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { postLike } from "./typs";

type PostServiceDependencies = {
  [TYPES.PostRepository]: PostRepository;
};
export class PostService {
  private postRepository: PostRepository;

  constructor(deps: PostServiceDependencies) {
    this.postRepository = deps[TYPES.PostRepository] as PostRepository;
  }

  async createPost(data: CreatePostDTO) {
    const baseSlug = data.postUrl;
    if (!data.userId) {
      throw new Error("userId가 없습니다.");
    }
    const isExist = await this.postRepository.isExistPostUrl(
      data.userId,
      data.postUrl
    );
    if (!isExist) {
      return await this.postRepository.createPost(data);
    }
    //있으면
    const similarSlugs = await this.postRepository.findSimilarPostUrls(
      data.userId,
      baseSlug
    );
    const regex = new RegExp(`^${baseSlug}-(\\d+)$`);
    let maxSuffix = 0;
    for (const slug of similarSlugs) {
      const match = slug.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num >= maxSuffix) {
          maxSuffix = num + 1;
        }
      }
    }
    const uniqueSlug = `${baseSlug}-${maxSuffix || 1}`;
    data.postUrl = uniqueSlug;
    return await this.postRepository.createPost(data);
  }

  async getAllPosts() {
    const posts = await this.postRepository.findAllPosts();
    const postsWithCommentCount = posts.map((post) => ({
      ...post,
      commentCount: post.comments.length,
    }));
    return postsWithCommentCount;
  }
  async getPost(id: number, userId?: number) {
    const post = await this.postRepository.findPost(id, userId);
    if (!post) {
      return null;
    }
    post.comments = post.comments
      ?.filter((comment) => {
        // 삭제된 댓글인데 replies가 없는 경우는 제거
        if (comment.isDeleted && comment.replies.length === 0) {
          return false;
        }
        return true;
      })
      .map((comment) => {
        if (comment.isDeleted && comment.replies.length > 0) {
          return {
            ...comment,
            content: "삭제된 메시지입니다",
          };
        }
        return comment;
      });
    return {
      ...post,
      isLiked: userId ? (post.likes ?? []).length > 0 : false, // ✅ 조건 분기
      likes: undefined, // optional: 프론트에 likes 배열 숨김
    };
  }
  async updatePost(data: UpdatePostDTO) {
    console.log("service" + data.id);
    if (!data.userId) {
      throw new Error("userId가 없습니다.");
    }
    return await this.postRepository.updatePost(data);
  }
  async deletePost(id: number) {
    this.postRepository.deletePost(id);
  }
  // async getAllPostsBySubdomain(subdomain: string) {
  //   const userId = await this.userService.getUserIdBySubdomain(subdomain);
  //   console.log("subdomain", subdomain);
  //   console.log("userId", userId);
  //   if (!userId) {
  //     throw new Error("해당 서브도메인에 대한 사용자가 없습니다.");
  //   }
  //   return this.postRepository.findAllByUserId(userId);
  // }
  async getBlogPostByuserId(userId: number, mine: boolean, page: number) {
    const posts = await this.postRepository.getBlogPostByuserId(
      userId,
      mine,
      page
    );
    const postsWithCommentCount = posts.map((post) => ({
      ...post,
      commentCount: post.comments.length,
    }));
    return postsWithCommentCount;
  }
  async getTotalCount(userId: number, mine: boolean) {
    return this.postRepository.getTotalCount(userId, mine);
  }
  async addPostLike(data: postLike) {
    return this.postRepository.addPostLike(data);
  }

  async deletePostLike(data: postLike) {
    return this.postRepository.deletePostLike(data);
  }
  async getPostId(subdomain: string, id: string) {
    console.log("getPostId Called");
    return this.postRepository.getPostId(subdomain, id);
  }
}
