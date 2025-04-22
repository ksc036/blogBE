import { PostRepository } from "./post.repository";
import { TYPES } from "../di/types";
interface CreatePostDTO {
  title: string;
  content: string;
  thumbnailUrl: string;
  desc: string;
  visibility: boolean;
  postUrl: string;
}
interface UpdatePostDTO {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  desc: string;
  visibility: boolean;
  postUrl: string;
}

export class PostService {
  private postRepository: PostRepository;

  constructor({
    [TYPES.PostRepository]: postRepository,
  }: {
    [TYPES.PostRepository]: PostRepository;
  }) {
    this.postRepository = postRepository;
  }

  async createPost(data: CreatePostDTO) {
    return this.postRepository.createPost(data);
  }

  async getAllPosts() {
    return this.postRepository.findAllPosts();
  }
  async getPost(id: number) {
    return this.postRepository.findPost(id);
  }
  async updatePost(data: UpdatePostDTO) {
    console.log("service" + data.id);
    return this.postRepository.updatePost(data);
  }
  async deletePost(id: number) {
    this.postRepository.deletePost(id);
  }
}
