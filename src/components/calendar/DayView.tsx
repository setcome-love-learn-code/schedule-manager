import type { CalendarDay } from '../../types/calendar';
import type { Item } from '../../types/item';
import ItemCard from '../item/ItemCard';

interface DayViewProps {
  day: CalendarDay;
  onEventClick?: (item: Item) => void;
}

export default function DayView({ day, onEventClick }: DayViewProps) {
  return (
    <div className="calendar-day-view">
      <h3 style={{ marginBottom: 16 }}>
        {day.date.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </h3>
      <div className="calendar-day-items">
        {day.items.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            此日期暂无项目。
          </p>
        ) : (
          day.items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onEventClick?.(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}
