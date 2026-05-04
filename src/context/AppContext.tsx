import { createContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { AppState } from '../types/state';
import type { AppAction } from './actions';
import { appReducer } from './appReducer';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

const initialState: AppState = {
  items: [],
  filters: {
    search: '',
    type: 'all',
    status: 'all',
    priority: 'all',
    tags: [],
  },
  calendar: {
    currentDate: new Date().toISOString(),
    view: 'month',
  },
  ui: {
    sidebarOpen: window.innerWidth > 768,
    modal: { open: false, mode: 'create' },
    theme: 'light',
  },
};

function initState(): AppState {
  const items = loadFromLocalStorage();
  return { ...initialState, items };
}

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, initState);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      saveToLocalStorage(state.items);
    }, 500);
    return () => clearTimeout(timer);
  }, [state.items]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
