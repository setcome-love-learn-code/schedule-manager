import type { CalendarDay } from '../../types/calendar';
import type { Item } from '../../types/item';
import CalendarCell from './CalendarCell';
import { DAY_NAMES } from '../../utils/date';

interface MonthViewProps {
  weeks: CalendarDay[][];
  onCellClick?: (day: CalendarDay) => void;
  onEventClick?: (item: Item) => void;
}

export default function MonthView({ weeks, onCellClick, onEventClick }: MonthViewProps) {
  return (
    <div className="calendar-grid">
      <div className="calendar-weekdays">
        {DAY_NAMES.map((name) => (
          <div key={name} className="calendar-weekday">{name}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="calendar-week">
          {week.map((day, di) => (
            <CalendarCell
              key={di}
              day={day}
              onClick={onCellClick}
              onEventClick={onEventClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
