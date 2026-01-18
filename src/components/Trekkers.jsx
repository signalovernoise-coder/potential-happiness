import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Trekkers.css';

const AVATAR_OPTIONS = [
  '🧗', '🥾', '🏔️', '🌲', '🦅', '🐨', '🦘', '🌊',
  '⛰️', '🏕️', '🎒', '🧭', '📸', '🌅', '🌟', '🔥',
];

export default function Trekkers() {
  const [trekkers, setTrekkers] = useLocalStorage('trek-trekkers', []);
  const [currentUser, setCurrentUser] = useLocalStorage('trek-current-user', '');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '🥾',
    experience: '',
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const existingTrekker = trekkers.find(
      (t) => t.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (existingTrekker) {
      // Update existing trekker
      setTrekkers(
        trekkers.map((t) =>
          t.name.toLowerCase() === formData.name.toLowerCase()
            ? { ...formData, congratulations: t.congratulations || [] }
            : t
        )
      );
    } else {
      // Add new trekker
      setTrekkers([...trekkers, { ...formData, congratulations: [] }]);
    }

    setCurrentUser(formData.name);
    setShowForm(false);
    setFormData({ name: '', avatar: '🥾', experience: '', reason: '' });
  };

  const handleCongratulate = (trekkerName) => {
    if (!currentUser) {
      alert('Please create your profile first to congratulate others!');
      return;
    }

    setTrekkers(
      trekkers.map((trekker) => {
        if (trekker.name === trekkerName) {
          const congrats = trekker.congratulations || [];
          const hasAlreadyCongratulated = congrats.some((c) => c.from === currentUser);

          if (hasAlreadyCongratulated) {
            // Remove congratulation
            return {
              ...trekker,
              congratulations: congrats.filter((c) => c.from !== currentUser),
            };
          } else {
            // Add congratulation
            return {
              ...trekker,
              congratulations: [
                ...congrats,
                { from: currentUser, date: new Date().toISOString() },
              ],
            };
          }
        }
        return trekker;
      })
    );
  };

  const currentTrekker = trekkers.find((t) => t.name === currentUser);

  return (
    <div className="trekkers">
      <div className="trekkers-header">
        <h2 className="section-title">Tassie Trekkers</h2>
        <p className="trekkers-subtitle">Meet your fellow adventurers!</p>
      </div>

      {currentUser && currentTrekker && (
        <div className="current-profile-banner">
          <span className="current-profile-label">Your Profile:</span>
          <span className="current-profile-avatar">{currentTrekker.avatar}</span>
          <span className="current-profile-name">{currentTrekker.name}</span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setFormData(currentTrekker);
              setShowForm(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      )}

      {!currentUser || showForm ? (
        <div className="card profile-form-card">
          <h3 className="card-title">
            {currentUser ? 'Edit Your Profile' : 'Create Your Profile'}
          </h3>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                className="form-input"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sarah"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Choose Your Avatar *</label>
              <div className="avatar-selector">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`avatar-option ${formData.avatar === emoji ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, avatar: emoji })}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Walking Experience</label>
              <select
                className="form-select"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              >
                <option value="">Select your experience level</option>
                <option value="Beginner">Beginner - First multi-day hike</option>
                <option value="Intermediate">Intermediate - Done a few multi-day hikes</option>
                <option value="Experienced">Experienced - Regular hiker</option>
                <option value="Expert">Expert - Seasoned trekker</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Why are you doing this trek?</label>
              <textarea
                className="form-textarea"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Share your motivation for this adventure..."
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {currentUser ? 'Update Profile' : 'Create Profile'}
              </button>
              {showForm && currentUser && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', avatar: '🥾', experience: '', reason: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Another Trekker
        </button>
      )}

      {trekkers.length > 0 && (
        <div className="trekkers-grid">
          {trekkers.map((trekker) => (
            <TrekkerCard
              key={trekker.name}
              trekker={trekker}
              currentUser={currentUser}
              onCongratulate={handleCongratulate}
            />
          ))}
        </div>
      )}

      {trekkers.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p>No trekkers yet. Create your profile to get started!</p>
        </div>
      )}
    </div>
  );
}

function TrekkerCard({ trekker, currentUser, onCongratulate }) {
  const congratsCount = (trekker.congratulations || []).length;
  const hasUserCongratulated = (trekker.congratulations || []).some(
    (c) => c.from === currentUser
  );

  return (
    <div className="trekker-card">
      <div className="trekker-avatar-large">{trekker.avatar}</div>
      <h3 className="trekker-name">{trekker.name}</h3>

      {trekker.experience && (
        <div className="trekker-badge">{trekker.experience}</div>
      )}

      {trekker.reason && (
        <div className="trekker-reason">
          <strong>Trek Motivation:</strong>
          <p>{trekker.reason}</p>
        </div>
      )}

      <div className="trekker-actions">
        <button
          className={`btn-congrats ${hasUserCongratulated ? 'active' : ''}`}
          onClick={() => onCongratulate(trekker.name)}
          disabled={!currentUser || trekker.name === currentUser}
        >
          <span className="congrats-icon">👏</span>
          <span className="congrats-text">
            {congratsCount > 0 ? congratsCount : 'Cheer'}
          </span>
        </button>
      </div>

      {congratsCount > 0 && (
        <div className="congrats-list">
          {trekker.congratulations.map((c, idx) => (
            <span key={idx} className="congrats-from">
              {c.from}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
