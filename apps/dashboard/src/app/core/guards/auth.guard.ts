import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../services/auth.store';
import { effect } from '@angular/core';

export const authGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.isAuthenticated()) {
        return true;
    }

    // If not authenticated, redirect to login
    router.navigate(['/login']);
    return false;
};
