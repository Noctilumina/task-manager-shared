import type { ITaskRepository } from '../repositories/ITaskRepository';
import type { Task, CreateTaskInput, UpdateTaskInput, SortBy } from '../types';

export class TaskService {
  constructor(private readonly repo: ITaskRepository) {}

  async getTasks(userId: string, sortBy: SortBy): Promise<Task[]> {
    const tasks = await this.repo.getAll(userId, sortBy);
    if (sortBy === 'dueDate') {
      return [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
    }
    return tasks;
  }

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    return this.repo.create(userId, input);
  }

  async updateTask(userId: string, taskId: string, input: UpdateTaskInput): Promise<Task> {
    return this.repo.update(userId, taskId, input);
  }

  async completeTask(userId: string, taskId: string): Promise<Task> {
    return this.repo.update(userId, taskId, { isComplete: true });
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    return this.repo.delete(userId, taskId);
  }

  subscribeToTasks(userId: string, onChange: (tasks: Task[]) => void): () => void {
    return this.repo.subscribeToChanges(userId, onChange);
  }
}
