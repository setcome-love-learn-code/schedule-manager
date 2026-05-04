import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useFilteredItems } from '../hooks/useFilteredItems';
import ItemFilterBar from '../components/item/ItemFilterBar';
import Modal from '../components/common/Modal';
import ItemForm from '../components/item/ItemForm';
import LearningStats from '../components/learning/LearningStats';
import MilestoneTracker from '../components/learning/MilestoneTracker';
import HourLogger from '../components/learning/HourLogger';

export default function LearningPage() {
  const { state, dispatch } = useAppContext();
  const filtered = useFilteredItems();
  const learningItems = filtered.filter(
    (item) => item.type === 'learning' || state.filters.type === 'all'
  );
  const modal = state.ui.modal;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selectedItem = modal.itemId
    ? state.items.find((i) => i.id === modal.itemId)
    : undefined;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>学习</h1>
        <button
          className="btn btn--primary"
          onClick={() =>
            dispatch({
              type: 'OPEN_MODAL',
              payload: { open: true, mode: 'create', itemType: 'learning' },
            })
          }
        >
          + 新课
        </button>
      </div>

      <LearningStats />
      <ItemFilterBar />

      <div className="item-list">
        {(learningItems.length > 0 ? learningItems : state.items.filter((i) => i.type === 'learning')).map((item) => (
          <div key={item.id} className="card">
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="card-header">
                <span className="card-title">{item.title}</span>
                <span className="card-meta">
                  {item.courseName && <span>{item.courseName}</span>}
                </span>
              </div>
              <div className="card-meta" style={{ marginBottom: 8 }}>
                <span>{item.loggedHours || 0}/{item.totalHours || '?'}h</span>
                <span style={{ flex: 1, maxWidth: 200 }}>
                  <div className="progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.totalHours ? Math.min((item.loggedHours || 0) / item.totalHours * 100, 100) : 0}%` }}
                      />
                    </div>
                    <span className="progress-label">
                      {item.totalHours ? Math.round((item.loggedHours || 0) / item.totalHours * 100) : 0}%
                    </span>
                  </div>
                </span>
              </div>
            </div>

            {expandedId === item.id && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border-light)' }}>
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label">记录学习时长</label>
                  <HourLogger itemId={item.id} />
                </div>
                <div>
                  <label className="form-label">里程碑</label>
                  <MilestoneTracker itemId={item.id} milestones={item.milestones || []} />
                </div>
                <div className="form-actions">
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => {
                      dispatch({ type: 'DELETE_ITEM', payload: { id: item.id } });
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {state.items.filter((i) => i.type === 'learning').length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">暂无课程</h3>
            <p className="empty-state-desc">开始追踪你的学习进度吧。</p>
          </div>
        )}
      </div>

      <Modal
        open={modal.open && modal.mode === 'create'}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        title={selectedItem ? '编辑课程' : '新课'}
      >
        <ItemForm
          defaultType="learning"
          item={selectedItem}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      </Modal>
    </div>
  );
}
