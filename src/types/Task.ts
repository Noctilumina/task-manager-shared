export type SortBy = 'dueDate' | 'createdAt' | 'custom';

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
  syncId: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  isComplete?: boolean;
}
