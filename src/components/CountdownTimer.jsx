import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ expiryMinutes, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`timer-badge ${timeLeft < 60 ? 'text-accent' : ''}`}>
      <Clock className="w-4 h-4" />
      <span>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
