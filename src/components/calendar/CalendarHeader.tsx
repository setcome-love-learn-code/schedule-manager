import { useAppContext } from '../../hooks/useAppContext';
import { formatMonthYear, parseDate } from '../../utils/date';
import type { CalendarView } from '../../types/calendar';

export default function CalendarHeader() {
  const { state, dispatch } = useAppContext();
  const currentDate = parseDate(state.calendar.currentDate);

  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => dispatch({ type: 'NAVIGATE_CALENDAR', payload: 'today' })}
        >
          今天
        </button>
        <button
          className="calendar-nav-btn"
          onClick={() => dispatch({ type: 'NAVIGATE_CALENDAR', payload: 'prev' })}
          aria-label="上一页"
        >
          ‹
        </button>
        <button
          className="calendar-nav-btn"
          onClick={() => dispatch({ type: 'NAVIGATE_CALENDAR', payload: 'next' })}
          aria-label="下一页"
        >
          ›
        </button>
        <h2 className="calendar-title">{formatMonthYear(currentDate)}</h2>
      </div>
      <div className="calendar-view-tabs">
        {(['month', 'week', 'day'] as CalendarView[]).map((view) => (
          <button
            key={view}
            className={`calendar-view-tab ${state.calendar.view === view ? 'calendar-view-tab--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CALENDAR_VIEW', payload: view })}
          >
            {view === 'month' ? '月' : view === 'week' ? '周' : '日'}
          </button>
        ))}
      </div>
    </div>
  );
}
