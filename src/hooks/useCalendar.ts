import { useMemo } from 'react';
import { useAppContext } from './useAppContext';
import { generateMonthGrid, getWeekDays, distributeItemsToDays } from '../utils/calendar';
import type { CalendarDay } from '../types/calendar';

export function useCalendarDays(): CalendarDay[] {
  const { state } = useAppContext();
  const { view } = state.calendar;
  const currentDate = new Date(state.calendar.currentDate);

  return useMemo(() => {
    if (view === 'month') {
      const weeks = generateMonthGrid(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );
      const days = weeks.flat();
      return distributeItemsToDays(state.items, days);
    }

    if (view === 'week') {
      const days = getWeekDays(currentDate).map((date) => ({
        date,
        isCurrentMonth: true,
        isToday: false,
        items: [] as typeof state.items,
      }));
      return distributeItemsToDays(state.items, days);
    }

    // day view
    const day: CalendarDay = {
      date: currentDate,
      isCurrentMonth: true,
      isToday: false,
      items: [],
    };
    return distributeItemsToDays(state.items, [day]);
  }, [state.items, state.calendar.currentDate, view, currentDate]);
}
