import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
})
export class AvatarUploadComponent implements OnInit {
  @Input()
  pictureProfile!: AbstractControl | FormControl | null;
  file: string = '';

  constructor() {}

  ngOnInit(): void {}

  resetInput() {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  onFileChange(event: any) {
    const formData = new FormData();
    const files = event.target.files as FileList;

    this.pictureProfile?.setValue(event.target.files[0]);
    const _file = URL.createObjectURL(files[0]);
    this.file = _file;
    // if (files.length > 0) {
    //   const fileUpload = files[0];
    //   const _file = URL.createObjectURL(files[0]);
    //   this.file = _file;
    //   reader.readAsDataURL(files[0]);
    //   reader.onload = () => {

    //   };

    //   this.resetInput();
    // }
  }
}
