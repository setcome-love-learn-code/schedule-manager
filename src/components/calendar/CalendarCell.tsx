import type { CalendarDay } from '../../types/calendar';
import type { Item } from '../../types/item';
import CalendarEventBar from './CalendarEventBar';

interface CalendarCellProps {
  day: CalendarDay;
  onClick?: (day: CalendarDay) => void;
  onEventClick?: (item: Item) => void;
}

export default function CalendarCell({ day, onClick, onEventClick }: CalendarCellProps) {
  const visibleEvents = day.items.slice(0, 3);
  const remaining = day.items.length - visibleEvents.length;

  return (
    <div
      className={`calendar-cell ${!day.isCurrentMonth ? 'calendar-cell--other-month' : ''} ${day.isToday ? 'calendar-cell--today' : ''}`}
      onClick={() => onClick?.(day)}
    >
      <div className="calendar-cell-day">{day.date.getDate()}</div>
      {visibleEvents.map((item) => (
        <CalendarEventBar
          key={item.id}
          item={item}
          onClick={onEventClick}
        />
      ))}
      {remaining > 0 && (
        <div className="calendar-more">+{remaining} 更多</div>
      )}
    </div>
  );
}
