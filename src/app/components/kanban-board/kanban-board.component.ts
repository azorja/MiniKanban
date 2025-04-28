import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../kanban-card/task-card.component';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { NewTaskComponent } from '../new-task/new-task.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, DragDropModule, NewTaskComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent {
  private taskService = inject(TaskService);

  tasksSignal = signal<Task[]>([]);
  selectedTask: Task | null = null;
  showModal = false;

  // Dohvacanje signala direktno iz servisa
  todoTasks = this.taskService.todoTasks;
  inProgressTasks = this.taskService.inProgressTasks;
  doneTasks = this.taskService.doneTasks;

  constructor() {
    this.taskService.loadTasks();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
  
  onTaskAdded(newTask: Task) {
    this.closeModal();
  }

  // Metoda koja se poziva kada se zadatak premjesti
  onDrop(event: CdkDragDrop<any>) {
    const movedTask = event.item.data;

    // Promjena statusa
    if (event.container.id === 'todoColumn') {
      movedTask.status = 'todo';
    } else if (event.container.id === 'inProgressColumn') {
      movedTask.status = 'in-progress';
    } else if (event.container.id === 'doneColumn') {
      movedTask.status = 'done';
    }

    // Optimistic update
    this.taskService.updateTaskStatus(movedTask.id, movedTask.status);
  }
}
