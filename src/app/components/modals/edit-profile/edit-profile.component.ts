import { Component } from '@angular/core';
import { Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent {
  @Input() user: any;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  editForm: FormGroup;
  isSaving = false;

  constructor(private fb: FormBuilder, private userService : UserService) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      username: [{value: '', disabled: true}, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.maxLength(10), Validators.required]],
      address: [''],
      location: [''],
      description: [''],
      profileImage: ['']
    });
  }

  ngOnChanges() {
    if (this.user) {
      this.editForm.patchValue({
        name: this.user.name,
        username: this.user.username,
        email: this.user.email,
        mobileNumber: this.user.mobileNumber,
        address: this.user.address,
        location: this.user.location,
        description: this.user.description,
        profileImage: this.user.profileImage
      });
    }
  }

  closeModal() {
    this.closed.emit();
  }

  saveChanges() {
    if (this.editForm.valid) {
      this.isSaving = true;
      setTimeout(() => {
        this.saved.emit(this.editForm.value);
      }, 1000);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editForm.patchValue({
          profileImage: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
