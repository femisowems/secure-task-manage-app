import { Component, inject, signal, isDevMode, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../core/services/auth.store';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      @if (isDev) {
        <div class="absolute top-4 right-4 bg-yellow-50 p-4 rounded-md shadow-md border border-yellow-200 text-sm max-w-xs z-50">
          <h3 class="font-bold text-yellow-800 mb-2">Dev Credentials</h3>
          <div class="space-y-2 text-left">
            <div>
              <span class="font-semibold block text-yellow-700">Admin (Owner):</span>
              <code class="bg-yellow-100 px-1 rounded">admin@test.com</code> / <code class="bg-yellow-100 px-1 rounded">password123</code>
            </div>
            <div>
              <span class="font-semibold block text-yellow-700">User (Viewer):</span>
              <code class="bg-yellow-100 px-1 rounded">user@test.com</code> / <code class="bg-yellow-100 px-1 rounded">password123</code>
            </div>
          </div>
        </div>
      }
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Secure Task Management App
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input formControlName="email" id="email-address" name="email" type="email" autocomplete="email" required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input formControlName="password" id="password" name="password" type="password" autocomplete="current-password" required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Password">
            </div>
          </div>

          @if (error()) {
            <div class="text-red-500 text-sm text-center">{{ error() }}</div>
          }

          <div>
            <button type="submit" [disabled]="isLoading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ isLoading() ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <div class="text-center">
            <a routerLink="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LoginPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  protected isDev = isDevMode();

  ngOnInit() {
    if (this.authStore.isAuthenticated()) {
      this.router.navigate(['/dashboard/tasks']);
    }
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = signal(false);
  error = signal('');

  async onSubmit() {
    if (this.loginForm.invalid) return;

    try {
      this.isLoading.set(true);
      this.error.set('');

      const { email, password } = this.loginForm.value;
      const { error } = await this.supabase.auth.signInWithPassword({
        email: email!,
        password: password!
      });

      if (error) throw error;

      // AuthStore will automatically pick up the session change
      this.router.navigate(['/dashboard/tasks']);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to login');
    } finally {
      this.isLoading.set(false);
    }
  }
}
