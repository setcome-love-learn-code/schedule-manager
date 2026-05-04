interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className={`progress ${size === 'sm' ? 'progress--sm' : ''}`}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="progress-label">{pct}%</span>}
    </div>
  );
}
