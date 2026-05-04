import type { ItemStatus } from '../../types/item';

const statusConfig: Record<ItemStatus, { label: string; className: string }> = {
  todo: { label: '待办', className: 'badge--todo' },
  in_progress: { label: '进行中', className: 'badge--in-progress' },
  done: { label: '已完成', className: 'badge--done' },
  cancelled: { label: '已取消', className: 'badge--cancelled' },
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`badge ${config.className}`}>{config.label}</span>
  );
}
