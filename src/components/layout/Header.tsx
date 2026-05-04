import { useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';

export default function Header() {
  const { state, dispatch } = useAppContext();

  const toggleTheme = () => {
    const newTheme = state.ui.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('schedule-manager-theme', newTheme);
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  useEffect(() => {
    const saved = localStorage.getItem('schedule-manager-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
      dispatch({ type: 'SET_THEME', payload: saved });
    }
  }, [dispatch]);

  return (
    <header className="header">
      <button
        className="header-menu-btn"
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <div className="header-spacer" />
      <button
        className="header-theme-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {state.ui.theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
