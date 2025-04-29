import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class AdminLoginComponent {

  credentials = {
    username: '',
    password: ''
  };
  isLoading = false;
  readonly loader = LoaderCircle;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toast: HotToastService
  ) { }

  login() {
    if (!this.credentials.username || !this.credentials.password) {
      this.toast.error('Please enter both username and password');
      return;
    }

    this.isLoading = true;
    this.adminService.login(this.credentials.username, this.credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
        this.isLoading = false;
      },
      error: (error) => {
        this.toast.error('Login failed, Invalid Credentials');
        this.isLoading = false;
      }
    });
  }

}
