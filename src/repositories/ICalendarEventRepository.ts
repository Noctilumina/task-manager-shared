import type { CalendarEvent } from '../types';

export interface ICalendarEventRepository {
  getAll(userId: string): Promise<CalendarEvent[]>;
  upsert(userId: string, event: CalendarEvent): Promise<CalendarEvent>;
  delete(userId: string, eventId: string): Promise<void>;
  subscribeToChanges(userId: string, onChange: (events: CalendarEvent[]) => void): () => void;
}
