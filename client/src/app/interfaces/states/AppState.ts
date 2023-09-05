import { LanguageStateInterface } from './LanguageStateInterface';
import { PostsStateInterface } from './PostsStateInterface';

export interface AppState {
  posts: PostsStateInterface;
  language: LanguageStateInterface;
}
