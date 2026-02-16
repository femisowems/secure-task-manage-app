import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus, TaskCategory, TaskPriority } from '../../../core/models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="submit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input formControlName="title" type="text"
               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
               placeholder="Task title">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea formControlName="description" rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Task description"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <select formControlName="category"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <select formControlName="status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            @for (status of statuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Priority</label>
          <select formControlName="priority"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            @for (priority of priorities; track priority) {
              <option [value]="priority">{{ priority }}</option>
            }
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button type="button" (click)="cancel.emit()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" [disabled]="taskForm.invalid"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-colors">
          {{ isEditing ? 'Update Task' : 'Create Task' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() task?: Task;
  @Output() onSubmit = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  categories = Object.values(TaskCategory);
  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: [TaskCategory.WORK, [Validators.required]],
    status: [TaskStatus.TODO, [Validators.required]],
    priority: [TaskPriority.MEDIUM, [Validators.required]]
  });

  get isEditing(): boolean {
    return !!this.task;
  }

  ngOnInit() {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        category: this.task.category,
        status: this.task.status,
        priority: this.task.priority
      });
    }
  }

  submit() {
    if (this.taskForm.valid) {
      this.onSubmit.emit(this.taskForm.value as Partial<Task>);
    }
  }
}
