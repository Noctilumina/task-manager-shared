export type SortBy = 'dueDate' | 'createdAt' | 'custom';

/**
 * All Date fields represent UTC timestamps.
 * Repository implementations are responsible for converting to/from
 * provider-specific formats (e.g. Firestore Timestamp ↔ Date).
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  isComplete: boolean;
  isFromCalendar: boolean;
  calendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
  /** Regenerated on every local write. Used by SyncService to detect which version is newer during conflict resolution. */
  syncId: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: Date;
}

/**
 * User-editable fields only.
 * isFromCalendar and calendarEventId are managed by the sync system and are intentionally excluded.
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  isComplete?: boolean;
}
