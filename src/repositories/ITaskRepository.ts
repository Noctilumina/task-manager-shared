import type { Task, CreateTaskInput, UpdateTaskInput, SortBy } from '../types';

export interface ITaskRepository {
  getAll(userId: string, sortBy: SortBy): Promise<Task[]>;
  getById(userId: string, taskId: string): Promise<Task | null>;
  create(userId: string, input: CreateTaskInput): Promise<Task>;
  update(userId: string, taskId: string, input: UpdateTaskInput): Promise<Task>;
  delete(userId: string, taskId: string): Promise<void>;
  subscribeToChanges(userId: string, onChange: (tasks: Task[]) => void): () => void;
}
