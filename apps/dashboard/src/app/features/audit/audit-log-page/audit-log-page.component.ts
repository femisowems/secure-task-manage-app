import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../../core/services/audit.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-audit-log-page',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Audit Log</h1>
      </div>

      @if (auditService.isLoading()) {
        <div class="text-center py-10 text-gray-500">Loading audit logs...</div>
      } @else if (logs().length === 0) {
        <div class="text-center py-10 bg-white rounded-lg border border-gray-200 text-gray-500">
          No audit logs found.
        </div>
      } @else {
        <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (log of logs(); track log.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{{ log.userId.slice(0, 8) }}...</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span [class]="'px-2 py-1 rounded-full text-xs font-medium ' + getActionClass(log.action)">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ log.resourceType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ log.timestamp | date:'medium' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class AuditLogPageComponent implements OnInit {
    public auditService = inject(AuditService);

    logs = this.auditService.logs;

    ngOnInit() {
        this.auditService.fetchLogs();
    }

    getActionClass(action: string): string {
        switch (action.toLowerCase()) {
            case 'create': return 'bg-green-50 text-green-700';
            case 'update': return 'bg-blue-50 text-blue-700';
            case 'delete': return 'bg-red-50 text-red-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    }
}
