import { Injectable, Signal, signal, computed } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly LOCAL_STORAGE_KEY = 'tasks';
  private tasksSource = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSource.asObservable();

  private tasksSignal = signal<Task[]>([]);

  todoTasks = computed(() => this.tasksSignal().filter(task => task.status === 'todo'));
  inProgressTasks = computed(() => this.tasksSignal().filter(task => task.status === 'in-progress'));
  doneTasks = computed(() => this.tasksSignal().filter(task => task.status === 'done'));

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.loadTasks();
  }

  loadTasks() {
    const storedTasks = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (storedTasks) {
      this.tasksSignal.set(JSON.parse(storedTasks));
    } else {
      this.http.get<any[]>('https://jsonplaceholder.typicode.com/todos?_limit=12')
        .subscribe(apiTasks => {
          const mappedTasks: Task[] = apiTasks.map(apiTask => ({
            id: apiTask.id,
            title: apiTask.title,
            status: this.mapIdToStatus(apiTask.id)
          }));
          this.tasksSignal.set(mappedTasks);
          this.saveTasks();
        });
    }
  }

  private mapIdToStatus(id: number): TaskStatus {
    const mod = id % 3;
    if (mod === 0) return 'todo';
    if (mod === 1) return 'in-progress';
    return 'done';
  }

  private saveTasks() {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }

  getTasksSignal(): Signal<Task[]> {
    return this.tasksSignal;
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus) {
    const updatedTasks = this.tasksSignal().map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    this.tasksSignal.set(updatedTasks);
    this.saveTasks();

    if (taskId <= 200) {
      // Samo za taskove koji su došli sa servera
      this.http.put(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        id: taskId,
        status: newStatus
      }).subscribe({
        next: () => {
          this.toastService.show('Task moved successfully!');
        },
        error: () => {
          this.tasksSignal.set(this.tasksSignal().map(task =>
            task.id === taskId ? { ...task, status: this.mapIdToStatus(task.id) } : task
          ));
          this.toastService.show('Error moving task, reverted.');
        }
      });
    } else {
      // samo localStorage
      this.toastService.show('Task moved locally!');
    }
  }

  addTask(newTask: Partial<Task>) {
    // Generiranje id-a za novi task
    const task: Task = {
      id: Date.now(),
      title: newTask.title || 'Untitled',
      status: newTask.status || 'todo',
      description: newTask.description || ''
    };

    const updatedTasks = [...this.tasksSignal(), task];
    this.tasksSignal.set(updatedTasks);
    this.saveTasks();

    // Sim POST-a
    this.http.post('https://jsonplaceholder.typicode.com/todos', task)
      .subscribe({
        next: () => {
          this.toastService.show('Task created successfully!');
        },
        error: () => {
          this.toastService.show('Failed to sync task with server.');
        }
      });
  }
}
