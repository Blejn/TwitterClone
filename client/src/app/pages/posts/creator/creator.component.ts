import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/interfaces/Post';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
})
export class CreatorComponent implements OnInit {
  postForm!: FormGroup;
  post!: Post;

  visibleMap: boolean = false;
  visibleEmoji: boolean = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    console.log(this.postForm.get('descripton'));
  }
  createForm() {
    this.postForm = this.fb.group({
      username: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      photo: ['', Validators.required],
      userid: ['', Validators.required],
    });
  }

  openNavigation() {
    this.visibleMap = !this.visibleMap;
    console.log(this.visibleMap);
  }
  closeNavigation(event: boolean) {
    this.visibleMap = event;
  }
  selectFile(event: Event) {
    let { value } = event.target as HTMLInputElement;
    console.log(value);
  }
  addEmoji(event: any) {
    let message = this.postForm.get('description')?.value;
    let newMessage = message.concat(`${event.emoji.native}`);
    this.postForm.controls['description'].setValue(newMessage);
  }
  changeVisibleEmoji() {
    this.visibleEmoji = !this.visibleEmoji;
  }

  addPost() {
    console.log(this.postForm.getRawValue());
    this.post = this.postForm.getRawValue();
  }
}
