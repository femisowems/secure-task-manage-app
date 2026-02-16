import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../core/services/auth.store';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Secure Task Management App
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input formControlName="email" id="email-address" name="email" type="email" autocomplete="email" required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input formControlName="password" id="password" name="password" type="password" autocomplete="new-password" required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Password">
            </div>
            <div>
              <label for="org-id" class="sr-only">Organization ID</label>
              <input formControlName="organizationId" id="org-id" name="organizationId" type="text" required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Organization ID (e.g. org-1)">
            </div>
          </div>

          @if (error()) {
            <div class="text-red-500 text-sm text-center">{{ error() }}</div>
          }

          @if (success()) {
            <div class="text-green-500 text-sm text-center">Signup successful! Please check your email and then <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">sign in</a>.</div>
          }

          <div>
            <button type="submit" [disabled]="isLoading() || success()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {{ isLoading() ? 'Creating account...' : 'Create Account' }}
            </button>
          </div>

          <div class="text-center">
            <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
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
export class SignupPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  ngOnInit() {
    if (this.authStore.isAuthenticated()) {
      this.router.navigate(['/dashboard/tasks']);
    }
  }

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    organizationId: ['', [Validators.required]]
  });

  isLoading = signal(false);
  error = signal('');
  success = signal(false);

  async onSubmit() {
    if (this.signupForm.invalid) return;

    try {
      this.isLoading.set(true);
      this.error.set('');

      const { email, password, organizationId } = this.signupForm.value;
      const { error } = await this.supabase.auth.signUp({
        email: email!,
        password: password!,
        options: {
          data: {
            organization_id: organizationId,
            role: 'Owner' // Default for new signups in this simplified version
          }
        }
      });

      if (error) throw error;

      this.success.set(true);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to sign up');
    } finally {
      this.isLoading.set(false);
    }
  }
}
