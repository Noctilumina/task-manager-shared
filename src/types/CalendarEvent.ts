export type CalendarSource = 'google' | 'outlook';

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
  lastSyncedAt: Date;
  updatedAt: Date;
}
