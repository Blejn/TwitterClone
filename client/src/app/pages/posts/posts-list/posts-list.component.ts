import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/Post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  posts: Post[] = [];
  public state: any = {
    data: '',
    page: 1,
    limit: 3,
  };

  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.postService
      .getPosts(this.state.data, this.state.page, this.state.limit)
      .subscribe({
        next: (response: any) =>
          response.results.map((post: Post) => this.posts.push(post)),
        error: (error) =>
          alert(
            'Wystąpił błąd podczas pobierania postów. Spróbuj ponownie później.'
          ),
        complete: () => console.log('wykonane'),
      });
  }

  loadMorePosts() {
    this.state.page += 1;
    this.postService
      .getPosts(this.state.data, this.state.page, this.state.limit)
      .subscribe({
        next: (response: any) =>
          response.results.map((post: Post) => this.posts.push(post)),
        error: () =>
          alert(
            'Wystąpił błąd podczas pobierania postów. Spróbuj ponownie później.'
          ),
      });
  }
}
