import { useRef, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { exportToJSON, importFromJSON } from '../utils/storage';
import { generateSampleData } from '../data/sampleData';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SettingsPage() {
  const { state, dispatch } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [error, setError] = useState('');

  const handleExport = () => {
    exportToJSON(state.items);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const items = await importFromJSON(file);
      dispatch({ type: 'IMPORT_DATA', payload: { items, merge: false } });
      setImportMsg(`成功导入 ${items.length} 个项目。`);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败');
      setImportMsg('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = () => {
    const data = generateSampleData();
    dispatch({ type: 'IMPORT_DATA', payload: { items: data, merge: false } });
    setImportMsg(`已加载 ${data.length} 条示例数据。`);
    setError('');
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    setShowClearConfirm(false);
    localStorage.removeItem('schedule-manager-data');
    setImportMsg('所有数据已清除。');
  };

  const lastUpdated = state.items.length > 0
    ? new Date(Math.max(...state.items.map((i) => new Date(i.timestamps.updatedAt).getTime()))).toLocaleString('zh-CN')
    : '无';

  const storageSize = new Blob([JSON.stringify(state.items)]).size;
  const sizeKB = (storageSize / 1024).toFixed(1);

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: 24 }}>设置</h1>

      {/* 数据摘要 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12, fontSize: '0.95rem' }}>数据摘要</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>总项目数：</span>
          <span>{state.items.length}</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>最近更新：</span>
          <span>{lastUpdated}</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>存储大小：</span>
          <span>{sizeKB} KB</span>
        </div>
      </div>

      {/* 导入/导出 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12, fontSize: '0.95rem' }}>导入 / 导出</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button className="btn btn--primary" onClick={handleExport}>
            导出 JSON
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            导入 JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button className="btn btn--secondary" onClick={handleLoadSample}>
            加载示例数据
          </button>
        </div>
        {importMsg && (
          <p style={{ color: 'var(--color-success)', fontSize: '0.85rem' }}>{importMsg}</p>
        )}
        {error && (
          <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem' }}>{error}</p>
        )}
      </div>

      {/* 危险操作 */}
      <div className="card" style={{ borderColor: 'var(--color-danger)' }}>
        <h3 style={{ marginBottom: 12, fontSize: '0.95rem', color: 'var(--color-danger)' }}>危险操作</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          此操作将永久删除所有数据。建议先导出备份。
        </p>
        <button
          className="btn btn--danger"
          onClick={() => setShowClearConfirm(true)}
        >
          清空所有数据
        </button>
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        title="清空所有数据"
        message="确定要删除所有数据吗？此操作不可撤销。"
        confirmLabel="确认清空"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
