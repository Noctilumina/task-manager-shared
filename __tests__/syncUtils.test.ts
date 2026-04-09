import { resolveConflict, generateSyncId } from '../src/utils/syncUtils';
import type { Task } from '../src/types';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1', userId: 'user-1', title: 'Test Task',
  isComplete: false, isFromCalendar: false,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
  syncId: 'sync-1',
  ...overrides,
});

describe('resolveConflict', () => {
  it('returns local when local is newer', () => {
    const local = makeTask({ title: 'Local', updatedAt: new Date('2026-01-02') });
    const remote = makeTask({ title: 'Remote', updatedAt: new Date('2026-01-01') });
    expect(resolveConflict(local, remote).title).toBe('Local');
  });

  it('returns remote when timestamps are equal (cloud wins)', () => {
    const ts = new Date('2026-01-01');
    const local = makeTask({ title: 'Local', updatedAt: ts });
    const remote = makeTask({ title: 'Remote', updatedAt: ts });
    expect(resolveConflict(local, remote).title).toBe('Remote');
  });

  it('returns remote when remote is newer', () => {
    const local = makeTask({ title: 'Local', updatedAt: new Date('2026-01-01') });
    const remote = makeTask({ title: 'Remote', updatedAt: new Date('2026-01-03') });
    expect(resolveConflict(local, remote).title).toBe('Remote');
  });
});

describe('generateSyncId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateSyncId()).toBe('string');
    expect(generateSyncId().length).toBeGreaterThan(0);
  });

  it('returns unique values each call', () => {
    expect(generateSyncId()).not.toBe(generateSyncId());
  });
});
