export default function ProgressBar({ current, total, label }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[14px] font-bold text-muted uppercase tracking-widest">{label}</span>
        <span className="text-[20px] font-bold text-ink tabular-nums">{percentage}%</span>
      </div>
      <div className="w-full bg-paper2 h-2 rounded-[4px] overflow-hidden">
        <div 
          className="bg-ink h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
