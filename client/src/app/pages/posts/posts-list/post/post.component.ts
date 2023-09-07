import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { CommentForm } from 'src/app/interfaces/CommentForm';
import { Post } from 'src/app/interfaces/Post';
import { UserDetails } from 'src/app/interfaces/UserDetails';
import { AppState } from 'src/app/interfaces/states/AppState';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import { v4 as uuidv4 } from 'uuid';
import * as PostsAcions from '../../store/actions/post.actions';
import { Comment } from './../../../../interfaces/Comment';

@Component({
  selector: 'post',
  animations: [
    trigger('expandCollapse', [
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
        })
      ),

      transition('open <=> closed', [animate('300ms ease-in')]),
    ]),
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, AfterContentInit {
  @Input()
  post!: Post;
  userDetails!: UserDetails | null;
  userId!: string;
  newComment!: FormGroup;
  viewComments: boolean = false;
  datePost!: string;
  time: { hours: string; minutes: string; days: string } = {
    days: '',
    hours: '',
    minutes: '',
  };
  comments: Comment[] = [];

  constructor(
    private cookieService: CookieServiceService,
    private store: Store<AppState>,
    private toast: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userDetails = this.cookieService.getUserDetails();
    this.parseComment();
    this.createComment();
  }

  ngAfterContentInit(): void {
    this.calculateTime();
  }
  parseComment() {
    this.post.comments.map((comment: string) => {
      if (comment) {
        let parsedComment: Comment = JSON.parse(comment);

        this.comments.push(parsedComment);
      }
    });
  }

  get isMyPost(): boolean {
    return this.post.username === this.userDetails?.username;
  }
  calculateTime() {
    this.time.hours = Math.floor(
      (new Date().getTime() - new Date(this.post.date).getTime()) /
        (1000 * 60 * 60)
    ).toString();

    this.time.minutes = Math.floor(
      (new Date().getTime() - new Date(this.post.date).getTime()) / (1000 * 60)
    ).toString();

    this.time.days = Math.floor(
      (new Date().getTime() - new Date(this.post.date).getTime()) /
        (1000 * 60 * 60) /
        24
    ).toString();
  }

  postDate() {
    if (Number(this.time.hours) === 0) {
      return this.time.minutes + ' minutes ago';
    } else if (Number(this.time.hours) < 24 && Number(this.time.hours) > 0) {
      return this.time.hours + ' hours ago';
    } else {
      return this.time.days + ' days ago';
    }
  }
  viewPostComments() {
    this.viewComments = !this.viewComments;
  }

  isReaction(): boolean | undefined {
    return this.post.reactions?.some((id) => this.userDetails?.id == id);
  }
  addReaction() {
    if (this.userDetails?.id && this.post.id) {
      const props = { postId: this.post.id, userId: this.userDetails?.id };

      this.store.dispatch(PostsAcions.addReactionToPost(props));
      this.toast.success('You like this post!');
    }
  }
  removeReaction() {
    if (this.userDetails?.id && this.post.id) {
      const props = { postId: this.post.id, userId: this.userDetails?.id };

      this.store.dispatch(PostsAcions.removeReactionFromPost(props));
      this.toast.success('You dislike this post!');
    }
  }
  createComment() {
    this.newComment = this.formBuilder.group({
      id: uuidv4(),
      userId: this.userDetails?.id,
      username: this.userDetails?.username,
      comment: this.formBuilder.control('', [Validators.required]),
      postId: this.post.id,
    });
  }
  onSubmit() {
    if (this.newComment.valid) {
      const data: CommentForm = this.newComment.getRawValue();
      this.store.dispatch(PostsAcions.addCommentToPost(data));
    }
    console.log(this.viewComments);
  }
}
