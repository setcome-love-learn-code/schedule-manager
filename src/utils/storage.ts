import type { Item } from '../types/item';

interface ExportData {
  version: number;
  exportedAt: string;
  appName: string;
  items: Item[];
}

const STORAGE_KEY = 'schedule-manager-data';

export function saveToLocalStorage(items: Item[]): void {
  try {
    const data: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      appName: 'Schedule Manager',
      items,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromLocalStorage(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as ExportData;
    if (!data || !Array.isArray(data.items)) return [];
    return data.items;
  } catch {
    return [];
  }
}

export function exportToJSON(items: Item[]): void {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    appName: 'Schedule Manager',
    items,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule-manager-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<Item[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data || !Array.isArray(data.items)) {
          reject(new Error('Invalid file format: missing items array'));
          return;
        }
        resolve(data.items as Item[]);
      } catch {
        reject(new Error('Unable to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
