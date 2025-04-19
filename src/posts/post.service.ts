import { PostRepository } from "./post.repository";

interface CreatePostDTO {
  title: string;
  content: string;
  author: string;
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
