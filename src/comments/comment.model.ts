export interface CreateCommentModel {
  postId: number;
  content: string;
  parentId?: number;
  userId: number;
}
