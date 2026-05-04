import type { Priority } from '../../types/item';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  urgent: { label: '紧急', className: 'badge--urgent' },
  high: { label: '高', className: 'badge--high' },
  medium: { label: '中', className: 'badge--medium' },
  low: { label: '低', className: 'badge--low' },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority];
  return (
    <span className={`badge ${config.className}`}>{config.label}</span>
  );
}
