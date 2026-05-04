export type ItemType = 'task' | 'learning' | 'project' | 'event';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ItemStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type ProjectPhaseStatus = 'not_started' | 'in_progress' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  order: number;
  status: ProjectPhaseStatus;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  phaseId?: string;
  status: TaskStatus;
  estimatedHours?: number;
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: string;
  count?: number;
  daysOfWeek?: number[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  timestamps: Timestamps;
  status: ItemStatus;
  priority: Priority;
  tags: string[];
  isAllDay: boolean;

  dueDate?: string;
  startDate?: string;
  endDate?: string;
  completedAt?: string;

  // task
  estimatedMinutes?: number;
  checklist?: ChecklistItem[];

  // learning
  courseName?: string;
  totalHours?: number;
  loggedHours?: number;
  milestones?: Milestone[];
  resourceUrls?: string[];

  // project
  phases?: ProjectPhase[];
  projectTasks?: ProjectTask[];
  progress?: number;

  // event
  location?: string;
  recurrence?: RecurrenceRule;
  reminderMinutes?: number[];
}
