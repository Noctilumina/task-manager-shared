import {
  getFirestore, collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc, query, orderBy,
  onSnapshot, Timestamp, type Firestore,
} from 'firebase/firestore';
import type { ITaskRepository } from './ITaskRepository';
import type { Task, CreateTaskInput, UpdateTaskInput, SortBy } from '../types';
import { generateSyncId } from '../utils/syncUtils';

function toTask(id: string, data: Record<string, unknown>): Task {
  const now = new Date();
  return {
    id,
    userId: data.userId as string,
    title: data.title as string,
    description: data.description as string | undefined,
    dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : undefined,
    isComplete: Boolean(data.isComplete),
    isFromCalendar: Boolean(data.isFromCalendar),
    calendarEventId: data.calendarEventId as string | undefined,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : now,
    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : now,
    syncId: (data.syncId as string) ?? generateSyncId(),
  };
}

export class FirebaseTaskRepository implements ITaskRepository {
  private db: Firestore;

  constructor() { this.db = getFirestore(); }

  private ref(userId: string) {
    return collection(this.db, 'tasks', userId, 'tasks');
  }

  async getAll(userId: string, sortBy: SortBy): Promise<Task[]> {
    const field = sortBy === 'dueDate' ? 'dueDate' : 'createdAt';
    const q = query(this.ref(userId), orderBy(field, sortBy === 'dueDate' ? 'asc' : 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => toTask(d.id, d.data() as Record<string, unknown>));
  }

  async getById(userId: string, taskId: string): Promise<Task | null> {
    const snap = await getDoc(doc(this.ref(userId), taskId));
    return snap.exists() ? toTask(snap.id, snap.data() as Record<string, unknown>) : null;
  }

  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const now = new Date();
    const data = {
      userId, title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
      isComplete: false, isFromCalendar: false, calendarEventId: null,
      createdAt: Timestamp.fromDate(now), updatedAt: Timestamp.fromDate(now),
      syncId: generateSyncId(),
    };
    const ref = await addDoc(this.ref(userId), data);
    return toTask(ref.id, { ...data, id: ref.id });
  }

  async update(userId: string, taskId: string, input: UpdateTaskInput): Promise<Task> {
    const ref = doc(this.ref(userId), taskId);
    const updates: Record<string, unknown> = {
      updatedAt: Timestamp.fromDate(new Date()),
      syncId: generateSyncId(),
    };
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.dueDate !== undefined) updates.dueDate = input.dueDate ? Timestamp.fromDate(input.dueDate) : null;
    if (input.isComplete !== undefined) updates.isComplete = input.isComplete;
    await updateDoc(ref, updates);
    const updated = await getDoc(ref);
    return toTask(updated.id, updated.data() as Record<string, unknown>);
  }

  async delete(userId: string, taskId: string): Promise<void> {
    await deleteDoc(doc(this.ref(userId), taskId));
  }

  subscribeToChanges(userId: string, onChange: (tasks: Task[]) => void): () => void {
    const q = query(this.ref(userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap =>
      onChange(snap.docs.map(d => toTask(d.id, d.data() as Record<string, unknown>)))
    );
  }
}
