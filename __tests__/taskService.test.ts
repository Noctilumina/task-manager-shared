import { TaskService } from '../src/services/taskService';
import { MockTaskRepository } from '../src/repositories/MockTaskRepository';

describe('TaskService', () => {
  let service: TaskService;
  beforeEach(() => { service = new TaskService(new MockTaskRepository()); });

  it('creates a task', async () => {
    const task = await service.createTask('user-1', { title: 'Buy milk' });
    expect(task.title).toBe('Buy milk');
    expect(task.isComplete).toBe(false);
  });

  it('marks a task complete', async () => {
    const task = await service.createTask('user-1', { title: 'Do laundry' });
    const updated = await service.completeTask('user-1', task.id);
    expect(updated.isComplete).toBe(true);
  });

  it('sorts tasks by dueDate', async () => {
    await service.createTask('user-1', { title: 'Later', dueDate: new Date('2026-02-01') });
    await service.createTask('user-1', { title: 'Soon', dueDate: new Date('2026-01-01') });
    const tasks = await service.getTasks('user-1', 'dueDate');
    expect(tasks[0].title).toBe('Soon');
  });

  it('deletes a task', async () => {
    const task = await service.createTask('user-1', { title: 'Delete me' });
    await service.deleteTask('user-1', task.id);
    const tasks = await service.getTasks('user-1', 'createdAt');
    expect(tasks.find(t => t.id === task.id)).toBeUndefined();
  });
});
