import { useMemo } from 'react';
import { useAppContext } from './useAppContext';
import type { Item } from '../types/item';

export function useFilteredItems(): Item[] {
  const { state } = useAppContext();
  const { filters } = state;

  return useMemo(() => {
    let result = [...state.items];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter((item) => item.type === filters.type);
    }

    if (filters.status !== 'all') {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.priority !== 'all') {
      result = result.filter((item) => item.priority === filters.priority);
    }

    if (filters.tags.length > 0) {
      result = result.filter((item) =>
        filters.tags.some((tag) => item.tags.includes(tag))
      );
    }

    // Sort by priority (urgent first), then by dueDate
    return result.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const pa = priorityOrder[a.priority];
      const pb = priorityOrder[b.priority];
      if (pa !== pb) return pa - pb;

      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return b.timestamps.createdAt.localeCompare(a.timestamps.createdAt);
    });
  }, [state.items, filters]);
}
