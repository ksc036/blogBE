import { PostRepository } from "./post.repository";

interface CreatePostDTO {
  title: string;
  content: string;
  thumbnailUrl: string;
  desc: string;
  visibility: boolean;
  postUrl: string;
}

export class PostService {
  private postRepository: PostRepository;

  constructor({ postRepository }: { postRepository: PostRepository }) {
    this.postRepository = postRepository;
  }

  async createPost(data: CreatePostDTO) {
    return this.postRepository.createPost(data);
  }

  async getAllPosts() {
    return this.postRepository.findAllPosts();
  }
}
