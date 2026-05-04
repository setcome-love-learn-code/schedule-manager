import type { CalendarDay } from '../../types/calendar';
import type { Item } from '../../types/item';
import { formatDate } from '../../utils/date';

interface AgendaPanelProps {
  days: CalendarDay[];
  onEventClick?: (item: Item) => void;
}

export default function AgendaPanel({ days, onEventClick }: AgendaPanelProps) {
  const allItems = days.flatMap((day) =>
    day.items.map((item) => ({ ...item, _date: day.date }))
  );

  return (
    <div className="calendar-agenda">
      <div className="calendar-agenda-title">日程</div>
      {allItems.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          暂无安排
        </p>
      ) : (
        allItems.map((item) => (
          <div
            key={item.id}
            className="calendar-agenda-item"
            onClick={() => onEventClick?.(item)}
          >
            <span className={`calendar-agenda-dot agenda-dot--${item.type}`} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', minWidth: 80 }}>
              {'_date' in item ? formatDate((item as unknown as { _date: Date })._date) : ''}
            </span>
            <span>{item.title}</span>
          </div>
        ))
      )}
    </div>
  );
}
