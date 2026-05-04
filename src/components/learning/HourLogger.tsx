import { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';

interface HourLoggerProps {
  itemId: string;
}

export default function HourLogger({ itemId }: HourLoggerProps) {
  const { dispatch } = useAppContext();
  const [hours, setHours] = useState('');

  const logHours = () => {
    const h = parseFloat(hours);
    if (isNaN(h) || h <= 0) return;
    dispatch({
      type: 'LOG_LEARNING_HOURS',
      payload: { id: itemId, hours: h },
    });
    setHours('');
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        className="form-input"
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder="小时数"
        min="0"
        step="0.5"
        style={{ width: 100 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); logHours(); }
        }}
      />
      <button className="btn btn--primary btn--sm" onClick={logHours}>
        记录时长
      </button>
    </div>
  );
}
