import type { ProjectPhase, ProjectTask } from '../../types/item';
import { useAppContext } from '../../hooks/useAppContext';

interface PhaseColumnProps {
  projectId: string;
  phase: ProjectPhase;
  tasks: ProjectTask[];
}

export default function PhaseColumn({ projectId, phase, tasks }: PhaseColumnProps) {
  const { dispatch } = useAppContext();

  const statusLabel = {
    not_started: '未开始',
    in_progress: '进行中',
    completed: '已完成',
  }[phase.status];

  const cycleStatus = () => {
    const next: Record<string, ProjectPhase['status']> = {
      not_started: 'in_progress',
      in_progress: 'completed',
      completed: 'not_started',
    };
    dispatch({
      type: 'SET_PHASE_STATUS',
      payload: { itemId: projectId, phaseId: phase.id, status: next[phase.status] },
    });
  };

  return (
    <div className="card" style={{ minWidth: 200, flex: 1 }}>
      <div
        className="card-header"
        style={{ cursor: 'pointer' }}
        onClick={cycleStatus}
      >
        <span className="card-title">{phase.name}</span>
        <span className={`badge badge--${phase.status === 'completed' ? 'done' : phase.status === 'in_progress' ? 'in-progress' : 'todo'}`}>
          {statusLabel}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {tasks
          .filter((t) => t.phaseId === phase.id)
          .map((task) => (
            <div
              key={task.id}
              className="card"
              style={{ padding: '8px 10px', fontSize: '0.85rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() =>
                    dispatch({
                      type: 'UPDATE_PROJECT_TASK',
                      payload: {
                        itemId: projectId,
                        taskId: task.id,
                        changes: { status: task.status === 'done' ? 'todo' : 'done' },
                      },
                    })
                  }
                />
                <span style={{
                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  flex: 1,
                }}>
                  {task.title}
                </span>
                {task.estimatedHours && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                    {task.estimatedHours}h
                  </span>
                )}
              </div>
            </div>
          ))}
        {tasks.filter((t) => t.phaseId === phase.id).length === 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', textAlign: 'center', padding: 8 }}>
            暂无任务
          </p>
        )}
      </div>
    </div>
  );
}
