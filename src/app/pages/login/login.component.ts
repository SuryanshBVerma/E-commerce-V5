import { Component } from '@angular/core';
import { LucideAngularModule, Loader, Eye, EyeOff } from 'lucide-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  readonly Loader = Loader;
  readonly eye = Eye;
  readonly eyeoff = EyeOff;
  isLoading = false;
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private toast: HotToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }


  ngOnInit() {
    const token = localStorage.getItem("auth_token");

    if (token) {
      this.authService.validateToken().subscribe((isValid) => {
        if (isValid) {
          this.router.navigate(["/products"]);
        }
      });
    } else {
      console.log("No token found.");
    }
  }


  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;
    console.log(username, password);

    setTimeout(() => {

      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/products']); // Redirect to dashboard or home
          this.toast.success("Successfully Logged In !")
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
