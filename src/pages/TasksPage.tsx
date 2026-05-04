import { useAppContext } from '../hooks/useAppContext';
import { useFilteredItems } from '../hooks/useFilteredItems';
import ItemFilterBar from '../components/item/ItemFilterBar';
import ItemList from '../components/item/ItemList';
import Modal from '../components/common/Modal';
import ItemForm from '../components/item/ItemForm';
import type { Item } from '../types/item';

export default function TasksPage() {
  const { state, dispatch } = useAppContext();
  const filteredItems = useFilteredItems();
  const modal = state.ui.modal;

  const tasks = filteredItems.filter(
    (item) => item.type === 'task' || state.filters.type === 'all'
  );

  const handleItemClick = (item: Item) => {
    dispatch({
      type: 'OPEN_MODAL',
      payload: { open: true, mode: 'detail', itemId: item.id },
    });
  };

  const selectedItem = modal.itemId
    ? state.items.find((i) => i.id === modal.itemId)
    : undefined;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>任务</h1>
        <button
          className="btn btn--primary"
          onClick={() =>
            dispatch({
              type: 'OPEN_MODAL',
              payload: { open: true, mode: 'create', itemType: 'task' },
            })
          }
        >
          + 新建任务
        </button>
      </div>

      <ItemFilterBar />

      <ItemList
        items={tasks}
        emptyTitle="暂无任务"
        emptyDescription="创建一个任务开始吧。"
        onItemClick={handleItemClick}
      />

      <Modal
        open={modal.open && modal.mode === 'create'}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        title={selectedItem ? '编辑任务' : '新建任务'}
      >
        <ItemForm
          defaultType={modal.itemType}
          item={selectedItem}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      </Modal>

      {selectedItem && modal.mode === 'detail' && (
        <Modal
          open={modal.open}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          title={selectedItem.title}
        >
          <ItemList items={[selectedItem]} />
          <div className="form-actions">
            <button
              className="btn btn--secondary"
              onClick={() =>
                dispatch({
                  type: 'OPEN_MODAL',
                  payload: { open: true, mode: 'edit', itemId: selectedItem.id },
                })
              }
            >
              编辑
            </button>
            <button
              className="btn btn--danger"
              onClick={() => {
                dispatch({ type: 'DELETE_ITEM', payload: { id: selectedItem.id } });
                dispatch({ type: 'CLOSE_MODAL' });
              }}
            >
              删除
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
