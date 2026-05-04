import { useAppContext } from '../hooks/useAppContext';
import { useCalendarDays } from '../hooks/useCalendar';
import CalendarHeader from '../components/calendar/CalendarHeader';
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import AgendaPanel from '../components/calendar/AgendaPanel';
import Modal from '../components/common/Modal';
import ItemList from '../components/item/ItemList';
import type { CalendarDay } from '../types/calendar';
import type { Item } from '../types/item';
import { generateMonthGrid, getWeekDays } from '../utils/calendar';
import { parseDate } from '../utils/date';
import '../styles/calendar.css';

export default function CalendarPage() {
  const { state, dispatch } = useAppContext();
  const { view, currentDate } = state.calendar;
  const date = parseDate(currentDate);

  const weeks = view === 'month'
    ? generateMonthGrid(date.getFullYear(), date.getMonth())
    : [];

  const weekDays = view === 'week'
    ? getWeekDays(date).map((d: Date) => ({
        date: d,
        isCurrentMonth: true,
        isToday: false,
        items: [] as Item[],
      }))
    : [];

  const calendarDays = useCalendarDays();

  const handleEventClick = (item: Item) => {
    dispatch({
      type: 'OPEN_MODAL',
      payload: { open: true, mode: 'detail', itemId: item.id },
    });
  };

  const handleCellClick = (day: CalendarDay) => {
    dispatch({ type: 'SET_CALENDAR_DATE', payload: day.date.toISOString() });
  };

  const selectedItem = state.ui.modal.itemId
    ? state.items.find((i) => i.id === state.ui.modal.itemId)
    : undefined;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>日历</h1>
      </div>

      <CalendarHeader />

      <div className="calendar-page">
        {view === 'month' && (
          <MonthView
            weeks={weeks}
            onCellClick={handleCellClick}
            onEventClick={handleEventClick}
          />
        )}

        {view === 'week' && (
          <WeekView
            days={weekDays}
            onEventClick={handleEventClick}
          />
        )}

        {view === 'day' && (
          <DayView
            day={calendarDays[0] || { date, isCurrentMonth: true, isToday: false, items: [] }}
            onEventClick={handleEventClick}
          />
        )}

        <div style={{ marginTop: 16 }}>
          <AgendaPanel
            days={view === 'month' ? weeks.flat() : weekDays}
            onEventClick={handleEventClick}
          />
        </div>
      </div>

      <Modal
        open={state.ui.modal.open && state.ui.modal.mode === 'detail'}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        title={selectedItem?.title || '详情'}
      >
        {selectedItem && (
          <>
            <ItemList items={[selectedItem]} />
            <div className="form-actions">
              <button
                className="btn btn--danger"
                onClick={() => {
                  dispatch({ type: 'DELETE_ITEM', payload: { id: selectedItem.id } });
                  dispatch({ type: 'CLOSE_MODAL' });
                }}
              >
                删除
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
