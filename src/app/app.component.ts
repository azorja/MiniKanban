import { Component } from '@angular/core';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { ToastComponent } from './components/toast/toast.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KanbanBoardComponent, CommonModule, ToastComponent],
  template: `
    <app-kanban-board></app-kanban-board>
    <app-toast></app-toast>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isOffline: boolean = !navigator.onLine;
  title = 'MiniKanban';

  ngOnInit() {
    // Pracenje promjene statusa mreže
    window.addEventListener('online', () => this.isOffline = false);
    window.addEventListener('offline', () => this.isOffline = true);
  }
}

