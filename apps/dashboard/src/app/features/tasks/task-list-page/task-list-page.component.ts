import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { LucideAngularModule } from 'lucide-angular';
import { TaskService } from '../../../core/services/task.service';
import { AuthStore } from '../../../core/services/auth.store';
import { UserRole, Task, TaskStatus, TaskCategory, TaskPriority } from '../../../core/models';
import { TaskFormComponent } from '../task-form/task-form.component';

type SortOption = 'newest' | 'oldest' | 'priority' | 'title';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TaskFormComponent, FormsModule, DragDropModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
        
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <!-- Search -->
          <div class="relative flex-1 md:w-64">
            <lucide-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" [size]="18"></lucide-icon>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Search tasks..."
              class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
          </div>

          <!-- Category Filter -->
          <div class="relative text-sm">
            <lucide-icon name="filter" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" [size]="16"></lucide-icon>
            <select
              [ngModel]="categoryFilter()"
              (ngModelChange)="categoryFilter.set($event)"
              class="appearance-none pl-8 pr-10 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>

          <!-- Sort -->
          <div class="relative text-sm">
            <lucide-icon name="sort-asc" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" [size]="16"></lucide-icon>
            <select
              [ngModel]="sortBy()"
              (ngModelChange)="sortBy.set($event)"
              class="appearance-none pl-8 pr-10 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">High Priority</option>
              <option value="title">A-Z</option>
            </select>
          </div>

          <button
            (click)="openCreate()"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <lucide-icon name="plus" [size]="20"></lucide-icon>
            New Task
          </button>
        </div>
      </div>

      @if (taskService.isLoading()) {
        <div class="text-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading your tasks...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6" cdkDropListGroup>
          <!-- TODO Column -->
          <div class="flex flex-col h-full bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 class="font-bold text-gray-700 flex items-center gap-2 mb-4 px-2 uppercase tracking-wider text-xs">
              <span class="w-2 h-2 rounded-full bg-gray-400"></span>
              To Do
              <span class="bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-auto text-[10px]">{{ todoTasks().length }}</span>
            </h2>
            
            <div
              cdkDropList
              [cdkDropListData]="todoTasks()"
              (cdkDropListDropped)="drop($event, statusMap.TODO)"
              class="flex-1 space-y-4 min-h-[500px]"
            >
              @for (task of todoTasks(); track task.id) {
                <div cdkDrag class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all active:scale-95 group">
                  <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-start">
                      <span [class]="'px-2 py-0.5 text-[10px] font-bold uppercase rounded ' + getCategoryClass(task.category)">
                        {{ task.category }}
                      </span>
                      <span [class]="'text-[10px] font-bold ' + getPriorityColor(task.priority)">
                        {{ task.priority }}
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 leading-tight">{{ task.title }}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2">{{ task.description }}</p>
                    <div class="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      @if (canEdit()) {
                        <button (click)="openEdit(task)" class="text-gray-400 hover:text-indigo-600">
                          <lucide-icon name="pencil" [size]="14"></lucide-icon>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- IN PROGRESS Column -->
          <div class="flex flex-col h-full bg-blue-50/50 rounded-lg p-4 border border-blue-100">
            <h2 class="font-bold text-blue-800 flex items-center gap-2 mb-4 px-2 uppercase tracking-wider text-xs">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              In Progress
              <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded ml-auto text-[10px]">{{ inProgressTasks().length }}</span>
            </h2>
            
            <div
              cdkDropList
              [cdkDropListData]="inProgressTasks()"
              (cdkDropListDropped)="drop($event, statusMap.IN_PROGRESS)"
              class="flex-1 space-y-4 min-h-[500px]"
            >
              @for (task of inProgressTasks(); track task.id) {
                <div cdkDrag class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all active:scale-95 group">
                   <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-start">
                      <span [class]="'px-2 py-0.5 text-[10px] font-bold uppercase rounded ' + getCategoryClass(task.category)">
                        {{ task.category }}
                      </span>
                      <span [class]="'text-[10px] font-bold ' + getPriorityColor(task.priority)">
                        {{ task.priority }}
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 leading-tight">{{ task.title }}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2">{{ task.description }}</p>
                    <div class="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      @if (canEdit()) {
                        <button (click)="openEdit(task)" class="text-gray-400 hover:text-indigo-600">
                          <lucide-icon name="pencil" [size]="14"></lucide-icon>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- COMPLETED Column -->
          <div class="flex flex-col h-full bg-green-50/50 rounded-lg p-4 border border-green-100">
            <h2 class="font-bold text-green-800 flex items-center gap-2 mb-4 px-2 uppercase tracking-wider text-xs">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              Completed
              <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded ml-auto text-[10px]">{{ completedTasks().length }}</span>
            </h2>
            
            <div
              cdkDropList
              [cdkDropListData]="completedTasks()"
              (cdkDropListDropped)="drop($event, statusMap.COMPLETED)"
              class="flex-1 space-y-4 min-h-[500px]"
            >
              @for (task of completedTasks(); track task.id) {
                <div cdkDrag class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all active:scale-95 group opacity-75">
                   <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-start">
                      <span [class]="'px-2 py-0.5 text-[10px] font-bold uppercase rounded ' + getCategoryClass(task.category)">
                        {{ task.category }}
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 leading-tight line-through opacity-50">{{ task.title }}</h3>
                    <div class="flex justify-end gap-2 mt-2">
                      @if (canEdit()) {
                        <div class="flex gap-2">
                          <button (click)="openEdit(task)" class="text-gray-400 hover:text-indigo-600">
                            <lucide-icon name="pencil" [size]="14"></lucide-icon>
                          </button>
                          <button (click)="deleteTask(task.id)" class="text-gray-400 hover:text-red-600">
                            <lucide-icon name="trash-2" [size]="14"></lucide-icon>
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (isModalOpen()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg w-full max-w-md p-6 relative shadow-2xl">
            <button
              (click)="isModalOpen.set(false)"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <lucide-icon name="x" [size]="24"></lucide-icon>
            </button>
            <h2 class="text-xl font-bold mb-4">{{ editingTask() ? 'Edit Task' : 'New Task' }}</h2>
            
            <app-task-form
              [task]="editingTask() || undefined"
              (onSubmit)="editingTask() ? handleUpdate($event) : handleCreate($event)"
              (cancel)="isModalOpen.set(false)"
            ></app-task-form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .cdk-drag-preview {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    .cdk-drag-placeholder { opacity: 0; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .cdk-drop-list-dragging .cdk-drag { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
  `]
})
export class TaskListPageComponent implements OnInit {
  public taskService = inject(TaskService);
  private authStore = inject(AuthStore);

  tasks = this.taskService.tasks;
  user = this.authStore.user;
  canEdit = computed(() => this.user()?.role !== UserRole.VIEWER);

  categories = Object.values(TaskCategory);
  statusMap = TaskStatus;

  // Filters & Search
  searchQuery = signal('');
  categoryFilter = signal<TaskCategory | 'all'>('all');
  sortBy = signal<SortOption>('newest');

  // Computed filtered and sorted tasks
  filteredTasks = computed(() => {
    let result = this.tasks();

    // 1. Search
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    const cat = this.categoryFilter();
    if (cat !== 'all') {
      result = result.filter(t => t.category === cat);
    }

    // 3. Sorting
    result = [...result].sort((a, b) => {
      switch (this.sortBy()) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority': {
          const pMap: Record<string, number> = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
          return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
        }
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    return result;
  });

  todoTasks = computed(() => this.filteredTasks().filter(t => t.status === TaskStatus.TODO));
  inProgressTasks = computed(() => this.filteredTasks().filter(t => t.status === TaskStatus.IN_PROGRESS));
  completedTasks = computed(() => this.filteredTasks().filter(t => t.status === TaskStatus.COMPLETED));

  isModalOpen = signal(false);
  editingTask = signal<Task | null>(null);

  ngOnInit() {
    this.taskService.fetchTasks();
  }

  resetFilters() {
    this.searchQuery.set('');
    this.categoryFilter.set('all');
    this.sortBy.set('newest');
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    if (event.previousContainer !== event.container) {
      const task = event.previousContainer.data[event.previousIndex];
      this.taskService.updateTask(task.id, { status: newStatus });
    }
  }

  getCategoryClass(category: string) {
    const classes: Record<string, string> = {
      [TaskCategory.WORK]: 'bg-indigo-100 text-indigo-800',
      [TaskCategory.PERSONAL]: 'bg-emerald-100 text-emerald-800',
      [TaskCategory.SHOPPING]: 'bg-amber-100 text-amber-800',
      [TaskCategory.OTHER]: 'bg-slate-100 text-slate-800'
    };
    return classes[category] || classes[TaskCategory.OTHER];
  }

  getPriorityColor(priority: string) {
    const classes: Record<string, string> = {
      [TaskPriority.HIGH]: 'text-red-600',
      [TaskPriority.MEDIUM]: 'text-orange-500',
      [TaskPriority.LOW]: 'text-sky-500'
    };
    return classes[priority] || classes[TaskPriority.LOW];
  }

  openCreate() {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  openEdit(task: Task) {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  handleCreate(data: Partial<Task>) {
    this.taskService.createTask(data);
    this.isModalOpen.set(false);
  }

  handleUpdate(data: Partial<Task>) {
    const task = this.editingTask();
    if (task) {
      this.taskService.updateTask(task.id, data);
      this.editingTask.set(null);
      this.isModalOpen.set(false);
    }
  }
}
