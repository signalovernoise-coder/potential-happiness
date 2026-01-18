import { useState, useEffect } from 'react';
import './Countdown.css';

const TREK_DATE = new Date('2026-03-17T00:00:00');

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const difference = TREK_DATE - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: true,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  }

  if (timeLeft.isPast) {
    return (
      <div className="countdown-card countdown-past">
        <div className="countdown-icon">🏔️</div>
        <div className="countdown-title">Trek Day!</div>
        <p className="countdown-message">The Three Capes Track adventure has begun!</p>
      </div>
    );
  }

  return (
    <div className="countdown-card">
      <div className="countdown-icon">⏱️</div>
      <div className="countdown-title">Countdown to Trek</div>
      <div className="countdown-date">March 17, 2026</div>

      <div className="countdown-grid">
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.days}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.hours}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.minutes}</div>
          <div className="countdown-label">Minutes</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.seconds}</div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>
    </div>
  );
}
