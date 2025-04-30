export interface CreateCommentDTO {
  postId: number;
  content: string;
  parentId?: number;
  userId?: number;
}

export interface UpdateCommentDTO {
  id: number;
  postId: number;
  content: string;
}

export interface DeleteCommentDTO {
  id: number;
}
