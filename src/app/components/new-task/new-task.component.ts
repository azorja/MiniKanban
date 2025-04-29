import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent {
  taskForm: FormGroup;

  @Output() taskAdded = new EventEmitter<Task>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required]
    });
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get status() { return this.taskForm.get('status'); }
  get priority() {return this.taskForm.get('priority'); }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;
  
      const task: Task = {
        id: Date.now(), // unique ID
        title: formValues.title,
        description: formValues.description,
        status: formValues.status as 'todo' | 'in-progress' | 'done',
        priority: formValues.priority as 'low' | 'medium' | 'high'
      };
  
      this.taskService.addTask(task);
      this.taskAdded.emit(task);
      this.taskForm.reset();
    }
  }
}
