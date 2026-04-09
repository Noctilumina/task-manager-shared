export type CalendarSource = 'google' | 'outlook';

/**
 * All Date fields represent UTC timestamps.
 * Repository implementations are responsible for converting to/from
 * provider-specific formats (e.g. Firestore Timestamp ↔ Date).
 */
export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  calendarSource: CalendarSource;
  externalId: string;
  syncedAsTask: boolean;
  taskId?: string;
  createdAt: Date;
  lastSyncedAt: Date;
  updatedAt: Date;
}
