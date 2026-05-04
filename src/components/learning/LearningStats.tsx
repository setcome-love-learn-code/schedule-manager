import { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';

export default function LearningStats() {
  const { state } = useAppContext();

  const stats = useMemo(() => {
    const items = state.items.filter((i) => i.type === 'learning');
    const total = items.length;
    const completed = items.filter((i) => i.status === 'done').length;
    const totalHours = items.reduce((s, i) => s + (i.totalHours || 0), 0);
    const loggedHours = items.reduce((s, i) => s + (i.loggedHours || 0), 0);
    return { total, completed, totalHours, loggedHours };
  }, [state.items]);

  const cards = [
    { label: '课程数', value: stats.total },
    { label: '已完成', value: stats.completed },
    { label: '已学习时长', value: stats.loggedHours },
    { label: '目标时长', value: stats.totalHours },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
      {cards.map((card) => (
        <div key={card.label} className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            {card.label}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
