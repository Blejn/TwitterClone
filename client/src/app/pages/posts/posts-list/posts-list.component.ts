import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { Post } from 'src/app/interfaces/Post';
import { AppState } from 'src/app/interfaces/states/AppState';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import { PostService } from 'src/app/services/post.service';
import * as PostsAcions from '../store/actions/post.actions';
import {
  allPostslengthtSelector,
  currentLengthtSelector,
  isLoadingSelector,
  postSelector,
} from '../store/selectors/post.selector';
import { PostResult } from './../../../interfaces/states/PostsStateInterface';

@Component({
  selector: 'posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PostsListComponent implements OnInit {
  isLoading$!: Observable<boolean>;
  length!: number;
  posts!: Post[];
  postsResult$!: PostResult;
  areMorePosts!: boolean;
  combined$ = combineLatest(
    this.store.pipe(select(currentLengthtSelector)),
    this.store.pipe(select(allPostslengthtSelector))
  );

  constructor(
    public postService: PostService,
    public cookieService: CookieServiceService,
    private store: Store<AppState>
  ) {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.store.dispatch(PostsAcions.getPosts());
    this.combined$.subscribe(([a, b]) =>
      a === b ? this.areMorePosts === false : this.areMorePosts === true
    );
    this.store
      .pipe(select(postSelector))
      .subscribe((results) => (this.posts = [...results]));
  }

  loadMorePosts() {
    this.store.dispatch(PostsAcions.getMorePosts());
  }
}
