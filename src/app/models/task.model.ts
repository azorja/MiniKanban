export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: number;
    title: string;
    status: TaskStatus;
    description?: string;
    priority?: TaskPriority;
}