import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PostForm } from 'src/app/interfaces/Post';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class CreatorComponent implements OnInit {
  post!: PostForm | {};
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.post = this.fb.group({
      username: '',
      location: '',
      description: '',
      photo: '',
      userId: '',
    });
  }
}
