import type { Item } from '../../types/item';
import { useAppContext } from '../../hooks/useAppContext';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { formatDate, parseDate } from '../../utils/date';

const typeIcons: Record<string, string> = {
  task: '✅',
  learning: '📚',
  project: '📋',
  event: '📅',
};

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const { dispatch } = useAppContext();

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_ITEM_COMPLETE', payload: { id: item.id } });
  };

  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          {item.type === 'task' && (
            <input
              type="checkbox"
              checked={item.status === 'done'}
              onChange={handleToggle}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <span>{typeIcons[item.type]}</span>
          <span className="card-title">{item.title}</span>
        </div>
        <div className="card-meta">
          <PriorityBadge priority={item.priority} />
          <StatusBadge status={item.status} />
        </div>
      </div>

      {item.description && (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          {item.description}
        </p>
      )}

      <div className="card-meta">
        {item.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="card-footer">
        {item.dueDate && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            截止: {formatDate(parseDate(item.dueDate))}
          </span>
        )}
        {item.type === 'learning' && item.totalHours && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            {item.loggedHours || 0}/{item.totalHours}h
          </span>
        )}
        {item.type === 'learning' && item.totalHours && (
          <ProgressBar value={item.loggedHours || 0} max={item.totalHours} size="sm" />
        )}
        {item.type === 'project' && item.progress !== undefined && (
          <ProgressBar value={item.progress} size="sm" />
        )}
      </div>
    </div>
  );
}