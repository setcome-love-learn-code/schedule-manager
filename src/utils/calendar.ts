import type { Item, RecurrenceRule } from '../types/item';
import type { CalendarDay, DateRange, CalendarView } from '../types/calendar';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
} from './date';

export function generateMonthGrid(year: number, month: number): CalendarDay[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const allDays: CalendarDay[] = [];

  // Previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    allDays.push({ date, isCurrentMonth: false, isToday: isToday(date), items: [] });
  }

  // Current month's days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    allDays.push({ date, isCurrentMonth: true, isToday: isToday(date), items: [] });
  }

  // Next month's leading days (fill to 42 = 6 rows)
  const remaining = 42 - allDays.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    allDays.push({ date, isCurrentMonth: false, isToday: isToday(date), items: [] });
  }

  // Split into 6 weeks of 7 days
  const weeks: CalendarDay[][] = [];
  for (let w = 0; w < 6; w++) {
    weeks.push(allDays.slice(w * 7, w * 7 + 7));
  }
  return weeks;
}

export function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export function getViewDateRange(date: Date, view: CalendarView): DateRange {
  if (view === 'month') {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 41);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  if (view === 'week') {
    const { start, end } = getWeekRange(date);
    return { start, end };
  }
  // day
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Reuse from date.ts
function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function getRecurrenceDates(rule: RecurrenceRule, range: DateRange): Date[] {
  const dates: Date[] = [];
  const current = new Date(range.start);
  const end = range.end;
  let count = 0;
  const maxOccurrences = rule.count || 365;

  while (current <= end && count < maxOccurrences) {
    if (rule.endDate && current > new Date(rule.endDate)) break;

    let matches = true;
    if (rule.frequency === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0) {
      matches = rule.daysOfWeek.includes(current.getDay());
    }

    if (matches) {
      dates.push(new Date(current));
      count++;
    }

    switch (rule.frequency) {
      case 'daily':
        current.setDate(current.getDate() + rule.interval);
        break;
      case 'weekly':
        current.setDate(current.getDate() + rule.interval * 7);
        break;
      case 'monthly':
        current.setMonth(current.getMonth() + rule.interval);
        break;
      case 'yearly':
        current.setFullYear(current.getFullYear() + rule.interval);
        break;
    }
  }

  return dates;
}

export function itemOccursOnDay(item: Item, day: Date): boolean {
  if (item.dueDate) {
    if (isSameDay(parseDate(item.dueDate), day)) return true;
  }

  if (item.startDate) {
    const start = parseDate(item.startDate);
    const end = item.endDate ? parseDate(item.endDate) : start;
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    if (start <= dayEnd && end >= dayStart) return true;
  }

  if (item.recurrence && item.startDate) {
    const range = {
      start: new Date(day),
      end: new Date(day),
    };
    range.start.setHours(0, 0, 0, 0);
    range.end.setHours(23, 59, 59, 999);
    const recurrences = getRecurrenceDates(item.recurrence, range);
    return recurrences.some((d) => isSameDay(d, day));
  }

  return false;
}

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function distributeItemsToDays(items: Item[], days: CalendarDay[]): CalendarDay[] {
  return days.map((day) => ({
    ...day,
    items: items.filter((item) => itemOccursOnDay(item, day.date)),
  }));
}
