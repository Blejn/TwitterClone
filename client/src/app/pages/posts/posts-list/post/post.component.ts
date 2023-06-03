import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/Post';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input()
  post!: Post;

  
  constructor() {}

  ngOnInit(): void {}
}
