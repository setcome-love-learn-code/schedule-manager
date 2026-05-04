import type { ProjectPhase } from '../../types/item';

interface ProjectTimelineProps {
  phases: ProjectPhase[];
}

export default function ProjectTimeline({ phases }: ProjectTimelineProps) {
  const sorted = [...phases].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
        暂无阶段定义。
      </p>
    );
  }

  return (
    <div style={{ position: 'relative', padding: '16px 0' }}>
      {sorted.map((phase, i) => (
        <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: phase.status === 'completed' ? 'var(--color-success)' : phase.status === 'in_progress' ? 'var(--color-warning)' : 'var(--color-bg-tertiary)',
            border: '2px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {phase.status === 'completed' ? '✓' : i + 1}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{phase.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
              {phase.status === 'not_started' ? '未开始' : phase.status === 'in_progress' ? '进行中' : '已完成'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
