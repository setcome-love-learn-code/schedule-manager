import { useState } from 'react';
import type { Milestone } from '../../types/item';
import { useAppContext } from '../../hooks/useAppContext';
import { generateId } from '../../utils/id';

interface MilestoneTrackerProps {
  itemId: string;
  milestones: Milestone[];
}

export default function MilestoneTracker({ itemId, milestones }: MilestoneTrackerProps) {
  const { dispatch } = useAppContext();
  const [newTitle, setNewTitle] = useState('');

  const addMilestone = () => {
    if (!newTitle.trim()) return;
    dispatch({
      type: 'ADD_MILESTONE',
      payload: {
        itemId,
        milestone: {
          id: generateId(),
          title: newTitle.trim(),
          completed: false,
        },
      },
    });
    setNewTitle('');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          className="form-input"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="添加里程碑..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addMilestone(); }
          }}
        />
        <button className="btn btn--primary btn--sm" onClick={addMilestone}>
          添加
        </button>
      </div>
      {milestones.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          暂无里程碑。
        </p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {milestones.map((m) => (
            <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={m.completed}
                onChange={() =>
                  dispatch({
                    type: 'TOGGLE_MILESTONE',
                    payload: { itemId, milestoneId: m.id },
                  })
                }
              />
              <span style={{
                textDecoration: m.completed ? 'line-through' : 'none',
                color: m.completed ? 'var(--color-text-tertiary)' : 'var(--color-text)',
                fontSize: '0.9rem',
              }}>
                {m.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
