import { createReducer, on } from '@ngrx/store';
import { CommentForm } from 'src/app/interfaces/CommentForm';
import * as PostsActions from '../actions/post.actions';
import { PostsStateInterface } from './../../../../interfaces/states/PostsStateInterface';
export const initialState: PostsStateInterface = {
  isLoading: false,
  posts: {
    next: { page: 0, limit: 0 },
    len: 0,
    results: [],
  },
  error: null,
};

export const reducers = createReducer(
  initialState,
  on(PostsActions.getPosts, (state) => ({ ...state, isLoading: true })),
  on(PostsActions.getPostsSuccessed, (state, action) => ({
    ...state,
    isLoading: false,
    posts: action.posts,
  })),
  on(PostsActions.getPostsFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(PostsActions.getMorePosts, (state) => ({ ...state, isLoading: true })),
  on(PostsActions.getMorePostsSuccessed, (state, { posts }) => ({
    ...state,
    isLoading: false,
    posts: {
      len: posts.len,
      results: [...state.posts.results, ...posts.results],
    },
  })),
  on(PostsActions.getMorePostsFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(PostsActions.addReactionToPost, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(PostsActions.addReactionSuccessed, (state, { postId, userId }) => {
    const updatedPosts = state.posts.results.map((post) =>
      post.id === postId
        ? { ...post, reactions: [...post.reactions, userId] }
        : post
    );
    return {
      ...state,
      isLoading: false,
      posts: {
        ...state.posts,
        results: updatedPosts,
      },
    };
  }),

  on(PostsActions.addReactionFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(PostsActions.removeReactionFromPost, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(
    PostsActions.removeReactionFromPostSuccess,
    (state, { postId, userId }) => {
      const updatedPosts = state.posts.results.map((post) =>
        post.id === postId
          ? { ...post, reactions: post.reactions.filter((id) => userId !== id) }
          : post
      );
      return {
        ...state,
        isLoading: false,
        posts: {
          ...state.posts,
          results: updatedPosts,
        },
      };
    }
  ),

  on(PostsActions.removeReactionFromPostFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(PostsActions.addCommentToPost, (state) => ({
    ...state,
    isLoadig: true,
  })),
  on(
    PostsActions.addCommentToPostSuccess,
    (state, { id, userId, username, comment, postId }) => {
      const updatedPosts = state.posts.results.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                JSON.stringify({
                  id: id,
                  userId: userId,
                  username: username,
                  comment: comment,
                }),
              ],
            }
          : post
      );
      return {
        ...state,
        isLoading: false,
        posts: {
          ...state.posts,
          results: updatedPosts,
        },
      };
    }
  ),
  on(PostsActions.addCommentToPostFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(PostsActions.deleteCommentFromPost, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(PostsActions.addCommentToPostSuccess, (state, { id, postId }) => {
    const updatedPosts = state.posts.results.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter((com: CommentForm) => id !== com.id),
          }
        : post
    );
    return {
      ...state,
      isLoading: false,
      posts: {
        ...state.posts,
        results: updatedPosts,
      },
    };
  }),
  on(PostsActions.deleteCommentFromPosttFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  }))
);
