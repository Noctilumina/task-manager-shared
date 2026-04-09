import type { ITaskRepository } from './ITaskRepository';
import type { Task, CreateTaskInput, UpdateTaskInput, SortBy } from '../types';
import { generateSyncId } from '../utils/syncUtils';

export class MockTaskRepository implements ITaskRepository {
  private tasks = new Map<string, Task>();
  private listeners: Array<(tasks: Task[]) => void> = [];

  private notify() {
    const all = Array.from(this.tasks.values());
    this.listeners.forEach(l => l(all));
  }

  async getAll(_userId: string, _sortBy: SortBy): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getById(_userId: string, taskId: string): Promise<Task | null> {
    return this.tasks.get(taskId) ?? null;
  }

  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const now = new Date();
    const task: Task = {
      id: generateSyncId(), userId, title: input.title,
      description: input.description, dueDate: input.dueDate,
      isComplete: false, isFromCalendar: false,
      createdAt: now, updatedAt: now, syncId: generateSyncId(),
    };
    this.tasks.set(task.id, task);
    this.notify();
    return task;
  }

  async update(_userId: string, taskId: string, input: UpdateTaskInput): Promise<Task> {
    const existing = this.tasks.get(taskId);
    if (!existing) throw new Error(`Task ${taskId} not found`);
    const updated = { ...existing, ...input, updatedAt: new Date(), syncId: generateSyncId() };
    this.tasks.set(taskId, updated);
    this.notify();
    return updated;
  }

  async delete(_userId: string, taskId: string): Promise<void> {
    this.tasks.delete(taskId);
    this.notify();
  }

  subscribeToChanges(_userId: string, onChange: (tasks: Task[]) => void): () => void {
    this.listeners.push(onChange);
    return () => { this.listeners = this.listeners.filter(l => l !== onChange); };
  }
}
