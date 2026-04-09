import { N8N_WEBHOOK_BASE_URL } from '../utils/constants';
import type { Task } from '../types';

export class CalendarService {
  constructor(private readonly webhookBase = N8N_WEBHOOK_BASE_URL) {}

  async pushTaskToCalendar(userId: string, task: Task): Promise<void> {
    if (!task.dueDate) return;
    const res = await fetch(`${this.webhookBase}/webhook/task-to-calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, taskId: task.id, title: task.title, description: task.description, dueDate: task.dueDate.toISOString() }),
    });
    if (!res.ok) console.error('[CalendarService] Push failed:', res.statusText);
  }

  async removeTaskFromCalendar(userId: string, task: Task): Promise<void> {
    if (!task.calendarEventId) return;
    const res = await fetch(`${this.webhookBase}/webhook/remove-calendar-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, calendarEventId: task.calendarEventId }),
    });
    if (!res.ok) console.error('[CalendarService] Remove failed:', res.statusText);
  }
}
