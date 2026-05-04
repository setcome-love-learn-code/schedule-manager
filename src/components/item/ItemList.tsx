import type { Item } from '../../types/item';
import ItemCard from './ItemCard';
import EmptyState from '../common/EmptyState';
import { useAppContext } from '../../hooks/useAppContext';

interface ItemListProps {
  items: Item[];
  emptyTitle?: string;
  emptyDescription?: string;
  onItemClick?: (item: Item) => void;
}

export default function ItemList({
  items,
  emptyTitle = '暂无内容',
  emptyDescription = '创建一个新的项目开始吧。',
  onItemClick,
}: ItemListProps) {
  const { dispatch } = useAppContext();

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={{
          label: '创建',
          onClick: () =>
            dispatch({
              type: 'OPEN_MODAL',
              payload: { open: true, mode: 'create' },
            }),
        }}
      />
    );
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        />
      ))}
    </div>
  );
}
