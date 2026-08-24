import { useState, useEffect } from 'react';

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    // Release Date: December 18, 2026
    const targetDate = new Date("December 18, 2026 00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30.4375);
        const days = Math.floor(totalDays % 30.4375);
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ months, days, hours, minutes, seconds });
      } else {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timerId = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timerId);
  }, []);

  const format = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex gap-4 p-4 bg-[#0d111a]/90 border border-[#00ff88]/30 rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.15)] backdrop-blur-md">
      {[
        { value: timeLeft.months, label: "Months" },
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Mins" },
        { value: timeLeft.seconds, label: "Secs" },
      ].map((unit, idx) => (
        <div key={idx} className={`flex flex-col items-center min-w-[60px] sm:min-w-[80px] ${idx !== 0 ? 'border-l border-white/10' : ''}`}>
          <span className="text-3xl font-mono font-bold text-[#00ff88]">
            {format(unit.value)}
          </span>
          <span className="text-[10px] uppercase tracking-tighter text-gray-500 mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
