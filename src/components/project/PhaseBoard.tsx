import type { ProjectPhase, ProjectTask } from '../../types/item';

interface PhaseBoardProps {
  projectId: string;
  phases: ProjectPhase[];
  tasks: ProjectTask[];
}

export default function PhaseBoard({ projectId, phases, tasks }: PhaseBoardProps) {
  if (phases.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
        暂无阶段，请先添加阶段。
      </p>
    );
  }

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      overflowX: 'auto',
      paddingBottom: 8,
    }}>
      {phases
        .sort((a, b) => a.order - b.order)
        .map((phase) => (
          <PhaseColumn
            key={phase.id}
            projectId={projectId}
            phase={phase}
            tasks={tasks}
          />
        ))}
    </div>
  );
}

// Import needs to be at the bottom to avoid circular issues
import PhaseColumn from './PhaseColumn';
