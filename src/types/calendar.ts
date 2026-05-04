import type { Item } from './item';

export type CalendarView = 'month' | 'week' | 'day';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  items: Item[];
}
