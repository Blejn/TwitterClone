import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/interfaces/Post';
import { CookieServiceService } from 'src/app/services/cookie-service.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
  animations: [],
})
export class CreatorComponent implements OnInit {
  postForm!: FormGroup;
  post!: Post;
  userDetails = {
    id: '',
    username: '',
    email: '',
  };
  visibleMap: boolean = false;
  visibleEmoji: boolean = false;
  fileToUpload: any;
  imageUrl: any;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private cookieService: CookieServiceService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.createForm();
    this.userDetails === this.cookieService.getUserDetails();
    console.log(new Date());
  }
  handleInputChange(event: any) {
    this.handleFileInput(event.target.files);
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.postForm.patchValue({
        photo: reader.result,
      });
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  createForm() {
    this.postForm = this.fb.group({
      username: [this.userDetails.username, Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      photo: ['', Validators.required],
      userid: [this.cookieService.getUserId(), Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  getUserDetails() {
    this.userDetails = Object.assign(
      this.userDetails,
      this.cookieService.getUserDetails()
    );
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
    this.postService.addPost(this.post).subscribe({
      next: (post) => {
        console.log(post);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  cancel() {}
}
