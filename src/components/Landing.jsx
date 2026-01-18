import { useState, useEffect } from 'react';
import './Landing.css';

const TREK_DATE = new Date('2026-03-17T00:00:00');

export default function Landing() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const difference = TREK_DATE - now;

    if (difference <= 0) {
      return { weeks: 0, days: 0, isPast: true };
    }

    const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    return { weeks, days, isPast: false };
  }

  if (timeLeft.isPast) {
    return (
      <div className="landing">
        <div className="hero">
          <div className="hero-content">
            <h1 className="landing-title">Welcome to Tassie Trekkers</h1>
            <p className="landing-subtitle">Three Capes Track Adventure</p>
            <div className="countdown-display countdown-past">
              <div className="trek-status">🏔️ The Trek Has Begun!</div>
              <p className="trek-message">Have an amazing adventure on the Three Capes Track!</p>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
              alt="Three Capes Track scenic view"
              className="track-image"
            />
          </div>
        </div>

        <div className="info-section">
          <h2>About the Three Capes Track</h2>
          <p>
            The Three Capes Track is a 46km, 4-day/3-night independent walking experience on the
            Tasman Peninsula, Tasmania. It showcases dramatic coastal scenery, including Cape Pillar,
            Cape Hauy, and Cape Raoul.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-content">
          <h1 className="landing-title">Welcome to Tassie Trekkers</h1>
          <p className="landing-subtitle">Three Capes Track Adventure</p>

          <div className="countdown-display">
            <div className="countdown-label">Trek Departure In:</div>
            <div className="countdown-numbers">
              {timeLeft.weeks > 0 && (
                <div className="countdown-unit">
                  <div className="countdown-number">{timeLeft.weeks}</div>
                  <div className="countdown-text">Week{timeLeft.weeks !== 1 ? 's' : ''}</div>
                </div>
              )}
              <div className="countdown-unit">
                <div className="countdown-number">{timeLeft.days}</div>
                <div className="countdown-text">Day{timeLeft.days !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="trek-date">March 17, 2026</div>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
            alt="Three Capes Track scenic view"
            className="track-image"
          />
          <div className="image-caption">
            Photo: Three Capes Track, Tasman Peninsula
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🥾</div>
            <h3>46 km Track</h3>
            <p>4 days and 3 nights of breathtaking coastal scenery</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🏔️</div>
            <h3>Three Capes</h3>
            <p>Cape Pillar, Cape Hauy, and Cape Raoul</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🏕️</div>
            <h3>Eco Huts</h3>
            <p>Comfortable accommodation with stunning views</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🌊</div>
            <h3>Coastal Beauty</h3>
            <p>Dramatic cliffs, wildlife, and ocean vistas</p>
          </div>
        </div>
      </div>

      <div className="quote-section">
        <blockquote>
          "One of the great coastal walks of the world"
          <cite>— Australian Geographic</cite>
        </blockquote>
      </div>
    </div>
  );
}
