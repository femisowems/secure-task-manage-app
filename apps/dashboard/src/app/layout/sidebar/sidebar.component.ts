import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../core/services/auth.store';
import { UserRole } from '../../core/models';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
    template: `
    <div class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div class="p-6 border-b border-gray-100">
        <h1 class="text-xl font-bold text-indigo-600 leading-tight">Secure Task<br />Management App</h1>
        <p class="text-xs text-gray-400 mt-1 uppercase tracking-wider">{{ role() }}</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <a routerLink="/dashboard/tasks" 
           routerLinkActive="bg-indigo-50 text-indigo-700 font-medium"
           [routerLinkActiveOptions]="{exact: false}"
           class="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-gray-600 hover:bg-gray-50">
          <lucide-icon name="layout-dashboard" [size]="20"></lucide-icon>
          Tasks
        </a>

        @if (isAdminOrOwner()) {
          <a routerLink="/dashboard/audit" 
             routerLinkActive="bg-indigo-50 text-indigo-700 font-medium"
             class="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-gray-600 hover:bg-gray-50">
            <lucide-icon name="shield-alert" [size]="20"></lucide-icon>
            Audit Log
          </a>
        }
      </nav>

      <div class="p-4 border-t border-gray-100">
        <button
          (click)="logout()"
          class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <lucide-icon name="log-out" [size]="20"></lucide-icon>
          Logout
        </button>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class SidebarComponent {
    private authStore = inject(AuthStore);

    user = this.authStore.user;
    role = computed(() => this.user()?.role || '');
    isAdminOrOwner = computed(() => {
        const r = this.role();
        return r === UserRole.ADMIN || r === UserRole.OWNER;
    });

    logout() {
        this.authStore.logout();
    }
}
