import type { Task } from '../types';

export function resolveConflict(local: Task, remote: Task): Task {
  if (local.updatedAt.getTime() > remote.updatedAt.getTime()) return local;
  return remote; // remote wins on tie (cloud is source of truth)
}

export function generateSyncId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
