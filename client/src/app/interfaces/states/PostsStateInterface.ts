import { Post } from '../Post';

export interface PostsStateInterface {
  isLoading: boolean;
  posts: PostResult;
  error: string | null;
}
export interface PostResult {
  next?: { page: number; limit: number };
  len: number;
  results: Post[];
}
