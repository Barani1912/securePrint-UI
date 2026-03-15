import { useRef } from 'react';

export default function PinInput({ value = '', onChange, disabled }) {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const newValue = value.split('');
    newValue[index] = val[val.length - 1];
    const joined = newValue.join('').slice(0, 4);
    onChange(joined);

    if (index < 3 && val) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-[16px] justify-center">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          className="w-[54px] h-[72px] bg-white border-2 border-border rounded-xl text-[28px] font-bold text-center shadow-sm focus:outline-none focus:border-ink focus:ring-4 focus:ring-ink/5 transition-all tabular-nums"
        />
      ))}
    </div>
  );
}
