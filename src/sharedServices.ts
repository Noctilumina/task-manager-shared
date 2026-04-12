import type { FirebaseApp } from 'firebase/app';
import { FirebaseTaskRepository } from './repositories/FirebaseTaskRepository';
import { TaskService } from './services/taskService';
import { SyncService } from './services/syncService';

export function createSharedServices(app: FirebaseApp) {
  const repo = new FirebaseTaskRepository(app);
  return {
    taskService: new TaskService(repo),
    syncService: new SyncService(repo, repo),
  };
}
