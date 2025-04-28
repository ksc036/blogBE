import { PostRepository } from "./post.repository";
import { TYPES } from "../di/types";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { UserService } from "../users/user.service";
type PostServiceDependencies = {
  [TYPES.PostRepository]: PostRepository;
  [TYPES.UserService]: UserService;
};
export class PostService {
  private postRepository: PostRepository;
  private userService: UserService;

  constructor(deps: PostServiceDependencies) {
    this.postRepository = deps[TYPES.PostRepository] as PostRepository;
    this.userService = deps[TYPES.UserService] as UserService;
  }

  async createPost(data: CreatePostDTO) {
    return this.postRepository.createPost(data);
  }

  async getAllPosts() {
    return this.postRepository.findAllPosts();
  }
  async getPost(id: number) {
    const post = await this.postRepository.findPost(id);
    if (post) {
      post.comments = post.comments
        .filter((comment) => {
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
    }

    return post;
  }
  async updatePost(data: UpdatePostDTO) {
    console.log("service" + data.id);
    return this.postRepository.updatePost(data);
  }
  async deletePost(id: number) {
    this.postRepository.deletePost(id);
  }
  async getAllPostsBySubdomain(subdomain: string) {
    const userId = await this.userService.getUserIdBySubdomain(subdomain);
    console.log("subdomain", subdomain);
    console.log("userId", userId);
    if (!userId) {
      throw new Error("해당 서브도메인에 대한 사용자가 없습니다.");
    }
    return this.postRepository.findAllByUserId(userId);
  }
}
