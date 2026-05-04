import type { Item } from '../types/item';

const VALID_TYPES = ['task', 'learning', 'project', 'event'];

export function validateImportData(data: unknown): data is { version: number; items: Item[] } {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== 'number') return false;
  if (!Array.isArray(obj.items)) return false;
  return obj.items.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const i = item as Record<string, unknown>;
    return (
      typeof i.id === 'string' &&
      typeof i.title === 'string' &&
      VALID_TYPES.includes(i.type as string)
    );
  });
}
