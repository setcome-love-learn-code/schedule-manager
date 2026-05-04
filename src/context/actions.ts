import type { Item, ItemStatus, Milestone, ProjectPhaseStatus, ProjectTask } from '../types/item';
import type { CalendarView } from '../types/calendar';
import type { FilterState, ModalState } from '../types/state';

export type AppAction =
  | { type: 'CREATE_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: { id: string; changes: Partial<Item> } }
  | { type: 'DELETE_ITEM'; payload: { id: string } }
  | { type: 'SET_ITEM_STATUS'; payload: { id: string; status: ItemStatus } }
  | { type: 'TOGGLE_ITEM_COMPLETE'; payload: { id: string } }
  | { type: 'TOGGLE_CHECKLIST_ITEM'; payload: { itemId: string; checklistId: string } }
  | { type: 'LOG_LEARNING_HOURS'; payload: { id: string; hours: number } }
  | { type: 'ADD_MILESTONE'; payload: { itemId: string; milestone: Milestone } }
  | { type: 'TOGGLE_MILESTONE'; payload: { itemId: string; milestoneId: string } }
  | { type: 'ADD_PROJECT_TASK'; payload: { itemId: string; task: ProjectTask } }
  | { type: 'UPDATE_PROJECT_TASK'; payload: { itemId: string; taskId: string; changes: Partial<ProjectTask> } }
  | { type: 'DELETE_PROJECT_TASK'; payload: { itemId: string; taskId: string } }
  | { type: 'SET_PHASE_STATUS'; payload: { itemId: string; phaseId: string; status: ProjectPhaseStatus } }
  | { type: 'SET_CALENDAR_DATE'; payload: string }
  | { type: 'SET_CALENDAR_VIEW'; payload: CalendarView }
  | { type: 'NAVIGATE_CALENDAR'; payload: 'prev' | 'next' | 'today' }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'OPEN_MODAL'; payload: ModalState }
  | { type: 'CLOSE_MODAL' }
  | { type: 'LOAD_DATA'; payload: Item[] }
  | { type: 'IMPORT_DATA'; payload: { items: Item[]; merge: boolean } }
  | { type: 'CLEAR_ALL_DATA' };
