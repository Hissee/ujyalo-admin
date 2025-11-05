import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Check if already logged in
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        // Check if user is admin
        if (res.user?.role !== 'admin') {
          this.errorMessage = 'Access denied. Admin privileges required.';
          this.toastService.error('Access denied. Admin privileges required.');
          this.loading = false;
          return;
        }

        // Store token and user data
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.toastService.success('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid email or password';
        this.toastService.error(err.error?.message || 'Login failed. Please try again.');
        this.loading = false;
      }
    });
  }
}

