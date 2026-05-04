import type { CalendarDay } from '../../types/calendar';
import type { Item } from '../../types/item';
import { DAY_NAMES } from '../../utils/date';

interface WeekViewProps {
  days: CalendarDay[];
  onEventClick?: (item: Item) => void;
}

export default function WeekView({ days, onEventClick }: WeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="calendar-week-view">
      <div />
      {days.map((day, i) => (
        <div key={i} className="calendar-weekday" style={{ padding: 8, textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}>
          {DAY_NAMES[day.date.getDay()]} {day.date.getDate()}
        </div>
      ))}
      {hours.map((hour) => (
        <>
          <div key={`lbl-${hour}`} className="calendar-hour-label">
            {String(hour).padStart(2, '0')}:00
          </div>
          {days.map((day, di) => (
            <div key={`cell-${di}-${hour}`} className="calendar-hour-cell">
              {day.items
                .filter((item) => item.startDate && new Date(item.startDate).getHours() === hour)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`calendar-event calendar-event--${item.type}`}
                    onClick={() => onEventClick?.(item)}
                    style={{ position: 'absolute', inset: '1px 2px' }}
                  >
                    {item.title}
                  </div>
                ))}
            </div>
          ))}
        </>
      ))}
    </div>
  );
}
