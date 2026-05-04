import type { Item } from '../../types/item';

interface CalendarEventBarProps {
  item: Item;
  onClick?: (item: Item) => void;
}

export default function CalendarEventBar({ item, onClick }: CalendarEventBarProps) {
  return (
    <div
      className={`calendar-event calendar-event--${item.type}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(item);
      }}
      title={item.title}
    >
      {item.title}
    </div>
  );
}
