import type { SortBy } from './Task';
import type { CalendarSource } from './CalendarEvent';

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
  syncMetadata: {
    lastSync: Date;
    version: number;
  };
}
