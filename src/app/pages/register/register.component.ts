import { Component } from '@angular/core';
import { LucideAngularModule, Loader, Eye, EyeOff } from 'lucide-angular';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  readonly Loader = Loader;
  readonly eye = Eye;
  readonly eyeoff = EyeOff;
  isLoading = false;
  registerForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private toast: HotToastService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      email: ['', Validators.required],
    });
  }



  register(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { name, username, password, email } = this.registerForm.value;
    console.log(this.registerForm.value);

    setTimeout(() => {
      
      this.authService.register(name, username, password, email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/products']); // Redirect to dashboard or home
          this.toast.success("Successfully Registered!!")
        },
        error: (error) => {
          this.isLoading = false;
          this.showError(error.error?.error || 'Login failed. Please try again.');
        }
      });
    }, 1000);
  }

  private showError(message: string): void {
    this.toast.error(message ? message : "This didn't work.")
  }
}
