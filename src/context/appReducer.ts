import type { AppState } from '../types/state';
import type { AppAction } from './actions';
import { generateTimestamp } from '../utils/id';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CREATE_ITEM': {
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'UPDATE_ITEM': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                ...action.payload.changes,
                timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
              }
            : item
        ),
      };
    }
    case 'DELETE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case 'SET_ITEM_STATUS': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                status: action.payload.status,
                timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
                completedAt:
                  action.payload.status === 'done'
                    ? generateTimestamp()
                    : item.completedAt,
              }
            : item
        ),
      };
    }
    case 'TOGGLE_ITEM_COMPLETE': {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.payload.id) return item;
          const isDone = item.status === 'done';
          return {
            ...item,
            status: isDone ? 'todo' : 'done',
            timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
            completedAt: isDone ? undefined : generateTimestamp(),
          };
        }),
      };
    }
    case 'TOGGLE_CHECKLIST_ITEM': {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.payload.itemId || !item.checklist) return item;
          return {
            ...item,
            checklist: item.checklist.map((c) =>
              c.id === action.payload.checklistId ? { ...c, done: !c.done } : c
            ),
            timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
          };
        }),
      };
    }
    case 'LOG_LEARNING_HOURS': {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.payload.id) return item;
          const newLogged = (item.loggedHours || 0) + action.payload.hours;
          return {
            ...item,
            loggedHours: newLogged,
            status:
              item.totalHours && newLogged >= item.totalHours
                ? 'done'
                : item.status === 'done'
                  ? 'in_progress'
                  : item.status,
            timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
          };
        }),
      };
    }
    case 'ADD_MILESTONE': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId
            ? {
                ...item,
                milestones: [...(item.milestones || []), action.payload.milestone],
                timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
              }
            : item
        ),
      };
    }
    case 'TOGGLE_MILESTONE': {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.payload.itemId || !item.milestones) return item;
          return {
            ...item,
            milestones: item.milestones.map((m) =>
              m.id === action.payload.milestoneId
                ? {
                    ...m,
                    completed: !m.completed,
                    completedAt: m.completed ? undefined : generateTimestamp(),
                  }
                : m
            ),
            timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
          };
        }),
      };
    }
    case 'ADD_PROJECT_TASK': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId
            ? {
                ...item,
                projectTasks: [...(item.projectTasks || []), action.payload.task],
                timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
              }
            : item
        ),
      };
    }
    case 'UPDATE_PROJECT_TASK': {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.payload.itemId || !item.projectTasks) return item;
          return {
            ...item,
            projectTasks: item.projectTasks.map((t) =>
              t.id === action.payload.taskId
                ? { ...t, ...action.payload.changes }
                : t
            ),
            timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
          };
        }),
      };
    }
    case 'DELETE_PROJECT_TASK': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.itemId && item.projectTasks
            ? {
                ...item,
                projectTasks: item.projectTasks.filter(
                  (t) => t.id !== action.payload.taskId
                ),
                timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
              }
            : item
        ),
      };
    }
    case 'SET_PHASE_STATUS': {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.payload.itemId || !item.phases) return item;
          const phases = item.phases.map((p) =>
            p.id === action.payload.phaseId
              ? { ...p, status: action.payload.status }
              : p
          );
          const completed = phases.filter((p) => p.status === 'completed').length;
          const progress = Math.round((completed / phases.length) * 100);
          return {
            ...item,
            phases,
            progress,
            timestamps: { ...item.timestamps, updatedAt: generateTimestamp() },
          };
        }),
      };
    }
    case 'SET_CALENDAR_DATE': {
      return {
        ...state,
        calendar: { ...state.calendar, currentDate: action.payload },
      };
    }
    case 'SET_CALENDAR_VIEW': {
      return {
        ...state,
        calendar: { ...state.calendar, view: action.payload },
      };
    }
    case 'NAVIGATE_CALENDAR': {
      const date = new Date(state.calendar.currentDate);
      switch (action.payload) {
        case 'prev':
          if (state.calendar.view === 'month') date.setMonth(date.getMonth() - 1);
          else if (state.calendar.view === 'week') date.setDate(date.getDate() - 7);
          else date.setDate(date.getDate() - 1);
          break;
        case 'next':
          if (state.calendar.view === 'month') date.setMonth(date.getMonth() + 1);
          else if (state.calendar.view === 'week') date.setDate(date.getDate() + 7);
          else date.setDate(date.getDate() + 1);
          break;
        case 'today':
          return {
            ...state,
            calendar: { ...state.calendar, currentDate: new Date().toISOString() },
          };
      }
      return {
        ...state,
        calendar: { ...state.calendar, currentDate: date.toISOString() },
      };
    }
    case 'SET_FILTER': {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    }
    case 'CLEAR_FILTERS': {
      return {
        ...state,
        filters: {
          search: '',
          type: 'all',
          status: 'all',
          priority: 'all',
          tags: [],
        },
      };
    }
    case 'TOGGLE_SIDEBAR': {
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
      };
    }
    case 'SET_THEME': {
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload },
      };
    }
    case 'OPEN_MODAL': {
      return {
        ...state,
        ui: { ...state.ui, modal: action.payload },
      };
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        ui: {
          ...state.ui,
          modal: { open: false, mode: 'create' },
        },
      };
    }
    case 'LOAD_DATA': {
      return { ...state, items: action.payload };
    }
    case 'IMPORT_DATA': {
      if (action.payload.merge) {
        const mergeMap = new Map(
          state.items.map((item) => [item.id, item])
        );
        action.payload.items.forEach((item) => mergeMap.set(item.id, item));
        return { ...state, items: Array.from(mergeMap.values()) };
      }
      return { ...state, items: action.payload.items };
    }
    case 'CLEAR_ALL_DATA': {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}
