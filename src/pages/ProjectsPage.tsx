import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import Modal from '../components/common/Modal';
import ItemForm from '../components/item/ItemForm';
import ProgressBar from '../components/common/ProgressBar';

export default function ProjectsPage() {
  const { state, dispatch } = useAppContext();
  const projects = state.items.filter((i) => i.type === 'project');
  const modal = state.ui.modal;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>项目</h1>
        <button
          className="btn btn--primary"
          onClick={() =>
            dispatch({
              type: 'OPEN_MODAL',
              payload: { open: true, mode: 'create', itemType: 'project' },
            })
          }
        >
          + 新建项目
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">暂无项目</h3>
          <p className="empty-state-desc">创建一个项目来分解工作阶段和任务。</p>
        </div>
      ) : (
        <div className="item-list">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">{project.title}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {project.phases?.length || 0} 个阶段
                  </span>
                </div>
                {project.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                    {project.description}
                  </p>
                )}
                <div className="card-footer">
                  <ProgressBar value={project.progress || 0} size="sm" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal
        open={modal.open && modal.mode === 'create'}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        title="新建项目"
      >
        <ItemForm
          defaultType="project"
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      </Modal>
    </div>
  );
}
