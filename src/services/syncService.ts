import type { ITaskRepository } from '../repositories/ITaskRepository';
import { resolveConflict } from '../utils/syncUtils';

export type SyncStatus = 'idle' | 'syncing' | 'error';

export class SyncService {
  private status: SyncStatus = 'idle';
  private listeners: Array<(s: SyncStatus) => void> = [];

  constructor(
    private readonly localRepo: ITaskRepository,
    private readonly remoteRepo: ITaskRepository,
  ) {}

  getStatus(): SyncStatus { return this.status; }

  onStatusChange(listener: (s: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private setStatus(s: SyncStatus) {
    this.status = s;
    this.listeners.forEach(l => l(s));
  }

  async sync(userId: string): Promise<void> {
    this.setStatus('syncing');
    try {
      const [localTasks, remoteTasks] = await Promise.all([
        this.localRepo.getAll(userId, 'createdAt'),
        this.remoteRepo.getAll(userId, 'createdAt'),
      ]);
      const remoteMap = new Map(remoteTasks.map(t => [t.id, t]));
      const localMap = new Map(localTasks.map(t => [t.id, t]));

      for (const local of localTasks) {
        const remote = remoteMap.get(local.id);
        if (!remote) {
          await this.remoteRepo.create(userId, { title: local.title, description: local.description, dueDate: local.dueDate });
        } else {
          const winner = resolveConflict(local, remote);
          if (winner.syncId !== remote.syncId) {
            await this.remoteRepo.update(userId, remote.id, { title: winner.title, description: winner.description, dueDate: winner.dueDate, isComplete: winner.isComplete });
          }
          if (winner.syncId !== local.syncId) {
            await this.localRepo.update(userId, local.id, { title: winner.title, description: winner.description, dueDate: winner.dueDate, isComplete: winner.isComplete });
          }
        }
      }

      for (const remote of remoteTasks) {
        if (!localMap.has(remote.id)) {
          await this.localRepo.create(userId, { title: remote.title, description: remote.description, dueDate: remote.dueDate });
        }
      }

      this.setStatus('idle');
    } catch (err) {
      this.setStatus('error');
      throw err;
    }
  }
}
