import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import ProgressBar from '../components/common/ProgressBar';
import { formatDate, parseDate, isSameDay } from '../utils/date';

export default function Dashboard() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const today = new Date();

  const { todayTasks, activeLearning, upcomingEvents } = useMemo(() => {
    const items = state.items;

    const todayTasks = items.filter(
      (item) =>
        item.type === 'task' &&
        item.status !== 'done' &&
        item.status !== 'cancelled' &&
        item.dueDate &&
        isSameDay(parseDate(item.dueDate), today)
    );

    const activeLearning = items
      .filter((item) => item.type === 'learning' && item.status === 'in_progress')
      .slice(0, 3);

    const upcomingEvents = items
      .filter(
        (item) =>
          item.type === 'event' &&
          item.startDate &&
          parseDate(item.startDate) >= today
      )
      .sort(
        (a, b) =>
          new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()
      )
      .slice(0, 5);

    return { todayTasks, activeLearning, upcomingEvents };
  }, [state.items, today]);

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {/* 今日任务 */}
        <div className="card">
          <div
            className="card-header"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/tasks')}
          >
            <h3>今日任务</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>查看全部 →</span>
          </div>
          {todayTasks.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
              今天没有待办任务 🎉
            </p>
          ) : (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {todayTasks.map((task) => (
                <div key={task.id} className="card" style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() =>
                        dispatch({
                          type: 'TOGGLE_ITEM_COMPLETE',
                          payload: { id: task.id },
                        })
                      }
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{task.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        {task.priority === 'urgent' ? '紧急' : task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 活跃学习 */}
        <div className="card">
          <div
            className="card-header"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/learning')}
          >
            <h3>进行中的学习</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>查看全部 →</span>
          </div>
          {activeLearning.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
              暂无进行中的课程。
            </p>
          ) : (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeLearning.map((item) => (
                <div key={item.id} className="card" style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    {item.courseName} — {item.loggedHours}/{item.totalHours}h
                  </div>
                  <ProgressBar value={item.loggedHours || 0} max={item.totalHours || 1} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 即将到来 */}
        <div className="card">
          <div
            className="card-header"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/calendar')}
          >
            <h3>即将到来的事件</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>查看全部 →</span>
          </div>
          {upcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
              暂无即将到来事件。
            </p>
          ) : (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card" style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{event.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {event.startDate && formatDate(parseDate(event.startDate))}
                    {event.location && ` · ${event.location}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 快速统计 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 24 }}>
        <QuickStat
          label="总项目数"
          value={state.items.length}
        />
        <QuickStat
          label="完成任务"
          value={state.items.filter((i) => i.type === 'task' && i.status === 'done').length}
        />
        <QuickStat
          label="课程数"
          value={state.items.filter((i) => i.type === 'learning').length}
        />
        <QuickStat
          label="活跃项目"
          value={state.items.filter((i) => i.type === 'project' && i.status === 'in_progress').length}
        />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}
