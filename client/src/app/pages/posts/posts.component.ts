import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  post!: string | null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => (this.post = param.get('id'))); // lepsze  i wydajniejsze niz korzystanie ze snapchota
  }
}
