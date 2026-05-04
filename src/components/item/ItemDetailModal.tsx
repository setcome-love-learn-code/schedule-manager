import Modal from '../common/Modal';
import ItemCard from './ItemCard';
import ItemForm from './ItemForm';
import type { Item } from '../../types/item';

interface ItemDetailModalProps {
  item: Item;
  open: boolean;
  onClose: () => void;
  mode: 'detail' | 'edit';
}

export default function ItemDetailModal({ item, open, onClose, mode }: ItemDetailModalProps) {
  if (mode === 'edit') {
    return (
      <Modal open={open} onClose={onClose} title="编辑项目">
        <ItemForm item={item} onClose={onClose} />
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={item.title}>
      <ItemCard item={item} />
      <div className="form-actions">
        <button className="btn btn--secondary" onClick={onClose}>
          关闭
        </button>
      </div>
    </Modal>
  );
}
