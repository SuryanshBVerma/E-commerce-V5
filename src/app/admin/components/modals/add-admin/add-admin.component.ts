import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { LucideAngularModule, UserPlus, X, LoaderCircle } from 'lucide-angular';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-add-admin',
  imports: [
    LucideAngularModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-admin.component.html',
  styles: ``
})
export class AddAdminComponent {

  @Input() isOpen: boolean = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() adminAdded = new EventEmitter<any>();


  readonly addIcon = UserPlus;
  readonly closeIcon = X;
  readonly loader = LoaderCircle;

  adminForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toast: HotToastService
  ) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['']
    });
  }

  onSubmit() {
    if (this.adminForm.invalid) {
      this.toast.error('Please fill all required fields correctly');
      return;
    }

    this.isSubmitting = true;
    console.log(this.adminForm.value);

    const adminDetails = {
      "name": this.adminForm.value.name,
      "username": this.adminForm.value.username,
      "password": this.adminForm.value.password,
      "mobileNumber": this.adminForm.value.mobileNumber,
      "address": this.adminForm.value.address,
      "email": this.adminForm.value.email
    };

    this.adminService.createAdmin(adminDetails).subscribe({
      next: (resposne) => {
        this.toast.success('Admin created successfully');
        this.closeModal();
        this.adminAdded.emit();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.log(error.error.error);
        this.toast.error(error.error.error || 'Failed to create admin');
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    this.adminForm.reset();
    this.modalClose.emit();
  }


}
