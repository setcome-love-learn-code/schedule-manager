import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import PhaseBoard from '../components/project/PhaseBoard';
import ProjectTimeline from '../components/project/ProjectTimeline';
import ProgressBar from '../components/common/ProgressBar';
import { generateId } from '../utils/id';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useAppContext();
  const project = state.items.find((i) => i.id === id);
  const [showTimeline, setShowTimeline] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');

  if (!project || project.type !== 'project') {
    return (
      <div>
        <h1>项目未找到</h1>
        <Link to="/projects" className="btn btn--secondary">返回项目列表</Link>
      </div>
    );
  }

  const phases = project.phases || [];
  const tasks = project.projectTasks || [];

  const addPhase = () => {
    if (!newPhaseName.trim()) return;
    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        id: project.id,
        changes: {
          phases: [
            ...phases,
            { id: generateId(), name: newPhaseName.trim(), order: phases.length, status: 'not_started' as const },
          ],
        },
      },
    });
    setNewPhaseName('');
  };

  const addTask = () => {
    if (!newTaskTitle.trim() || !selectedPhase) return;
    dispatch({
      type: 'ADD_PROJECT_TASK',
      payload: {
        itemId: project.id,
        task: {
          id: generateId(),
          title: newTaskTitle.trim(),
          phaseId: selectedPhase,
          status: 'todo',
        },
      },
    });
    setNewTaskTitle('');
  };

  return (
    <div>
      <Link to="/projects" style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: 16, display: 'inline-block' }}>
        ← 返回项目列表
      </Link>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h1 style={{ fontSize: '1.5rem' }}>{project.title}</h1>
        </div>
        {project.description && (
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 12 }}>{project.description}</p>
        )}
        <ProgressBar value={project.progress || 0} />
      </div>

      {/* 添加阶段 */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8, fontSize: '0.95rem' }}>添加阶段</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="form-input"
            type="text"
            value={newPhaseName}
            onChange={(e) => setNewPhaseName(e.target.value)}
            placeholder="阶段名称"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPhase(); } }}
          />
          <button className="btn btn--primary btn--sm" onClick={addPhase}>添加</button>
        </div>
      </div>

      {/* 阶段面板 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ fontSize: '0.95rem' }}>阶段面板</h3>
          <button
            className="btn btn--secondary btn--sm"
            onClick={() => setShowTimeline(!showTimeline)}
          >
            {showTimeline ? '看板视图' : '时间线视图'}
          </button>
        </div>
        {showTimeline ? (
          <ProjectTimeline phases={phases} />
        ) : (
          <PhaseBoard projectId={project.id} phases={phases} tasks={tasks} />
        )}
      </div>

      {/* 添加任务 */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8, fontSize: '0.95rem' }}>添加任务</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="任务名称"
            style={{ flex: 1, minWidth: 150 }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTask(); } }}
          />
          <select
            className="form-select"
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="">选择阶段</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button className="btn btn--primary btn--sm" onClick={addTask}>添加</button>
        </div>
      </div>
    </div>
  );
}
