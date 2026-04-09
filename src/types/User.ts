import type { SortBy } from './Task';
import type { CalendarSource } from './CalendarEvent';

/**
 * All Date fields represent UTC timestamps.
 * Repository implementations are responsible for converting to/from
 * provider-specific formats (e.g. Firestore Timestamp ↔ Date).
 */
export interface SyncMetadata {
  lastSync: Date;
  version: number;
}

export interface UserPreferences {
  sortBy: SortBy;
  theme: 'light' | 'dark' | 'system';
  calendarProviders: CalendarSource[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences: UserPreferences;
  syncMetadata: SyncMetadata;
}
