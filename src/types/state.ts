import type { Item, ItemType, ItemStatus, Priority } from './item';
import type { CalendarView } from './calendar';

export interface FilterState {
  search: string;
  type: ItemType | 'all';
  status: ItemStatus | 'all';
  priority: Priority | 'all';
  tags: string[];
}

export interface CalendarState {
  currentDate: string;
  view: CalendarView;
}

export interface ModalState {
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  itemId?: string;
  itemType?: ItemType;
}

export interface UIState {
  sidebarOpen: boolean;
  modal: ModalState;
  theme: 'light' | 'dark';
}

export interface AppState {
  items: Item[];
  filters: FilterState;
  calendar: CalendarState;
  ui: UIState;
}
