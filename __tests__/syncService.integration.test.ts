import { SyncService } from '../src/services/syncService';
import { MockTaskRepository } from '../src/repositories/MockTaskRepository';

describe('SyncService', () => {
  let syncService: SyncService;
  let localRepo: MockTaskRepository;
  let remoteRepo: MockTaskRepository;

  beforeEach(() => {
    localRepo = new MockTaskRepository();
    remoteRepo = new MockTaskRepository();
    syncService = new SyncService(localRepo, remoteRepo);
  });

  it('pushes local task to remote', async () => {
    await localRepo.create('user-1', { title: 'Local task' });
    await syncService.sync('user-1');
    const remoteTasks = await remoteRepo.getAll('user-1', 'createdAt');
    expect(remoteTasks.some(t => t.title === 'Local task')).toBe(true);
  });

  it('pulls remote task into local', async () => {
    await remoteRepo.create('user-1', { title: 'Remote task' });
    await syncService.sync('user-1');
    const localTasks = await localRepo.getAll('user-1', 'createdAt');
    expect(localTasks.some(t => t.title === 'Remote task')).toBe(true);
  });

  it('keeps newer local task on conflict', async () => {
    const local = await localRepo.create('user-1', { title: 'Old' });
    await remoteRepo.create('user-1', { title: 'Old' });
    await new Promise(r => setTimeout(r, 10));
    await localRepo.update('user-1', local.id, { title: 'New from local' });
    await syncService.sync('user-1');
    const tasks = await localRepo.getAll('user-1', 'createdAt');
    expect(tasks.some(t => t.title === 'New from local')).toBe(true);
  });
});
