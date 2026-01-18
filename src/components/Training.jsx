import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Training.css';

export default function Training() {
  const [userName, setUserName] = useLocalStorage('trek-username', '');
  const [trainingData, setTrainingData] = useLocalStorage('trek-training', {});
  const [showNamePrompt, setShowNamePrompt] = useState(!userName);

  const currentUserData = trainingData[userName] || {
    goal: '',
    activities: [],
  };

  const updateGoal = (goal) => {
    setTrainingData({
      ...trainingData,
      [userName]: {
        ...currentUserData,
        goal,
      },
    });
  };

  const addActivity = (activity) => {
    setTrainingData({
      ...trainingData,
      [userName]: {
        ...currentUserData,
        activities: [...(currentUserData.activities || []), activity],
      },
    });
  };

  const deleteActivity = (activityId) => {
    setTrainingData({
      ...trainingData,
      [userName]: {
        ...currentUserData,
        activities: currentUserData.activities.filter(
          (activity) => activity.id !== activityId
        ),
      },
    });
  };

  const setName = (name) => {
    if (name.trim()) {
      setUserName(name.trim());
      setShowNamePrompt(false);
    }
  };

  if (showNamePrompt) {
    return (
      <div className="training">
        <div className="card name-prompt">
          <h2 className="card-title">Training Tracker</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Please enter your name to track your training progress.
          </p>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setName(e.target.value);
                }
              }}
              autoFocus
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              const input = e.target.parentElement.querySelector('input');
              setName(input.value);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="training">
      <div className="training-header">
        <div>
          <h2 className="section-title">Training Tracker</h2>
          <p className="training-subtitle">Tracking for: {userName}</p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowNamePrompt(true)}
        >
          Switch User
        </button>
      </div>

      <div className="training-content">
        <GoalSection
          goal={currentUserData.goal}
          onUpdateGoal={updateGoal}
        />

        <ActivityLog
          activities={currentUserData.activities || []}
          onAddActivity={addActivity}
          onDeleteActivity={deleteActivity}
        />

        <TeamOverview trainingData={trainingData} currentUser={userName} />
      </div>
    </div>
  );
}

function GoalSection({ goal, onUpdateGoal }) {
  const [isEditing, setIsEditing] = useState(!goal);
  const [editedGoal, setEditedGoal] = useState(goal);

  const saveGoal = () => {
    onUpdateGoal(editedGoal);
    setIsEditing(false);
  };

  return (
    <div className="card goal-section">
      <div className="goal-header">
        <h3 className="card-title">Your Goal</h3>
        {!isEditing && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            className="form-textarea"
            value={editedGoal}
            onChange={(e) => setEditedGoal(e.target.value)}
            placeholder="Set your training goal, e.g., 'Complete 3 hikes per week, build up to 15km with 500m elevation'"
          />
          <div className="form-actions" style={{ marginTop: '0.75rem' }}>
            <button className="btn btn-primary" onClick={saveGoal}>
              Save Goal
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setIsEditing(false);
                setEditedGoal(goal);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="goal-text">{goal || 'No goal set yet.'}</p>
      )}
    </div>
  );
}

function ActivityLog({ activities, onAddActivity, onDeleteActivity }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'Hike',
    duration: '',
    distance: '',
    elevation: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const activityTypes = ['Hike', 'Run', 'Gym', 'Cycling', 'Swimming', 'Other'];

  const addActivity = () => {
    if (!newActivity.type || !newActivity.duration) return;

    onAddActivity({
      ...newActivity,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });

    setNewActivity({
      type: 'Hike',
      duration: '',
      distance: '',
      elevation: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAdding(false);
  };

  const totalStats = activities.reduce(
    (acc, activity) => {
      if (activity.duration) {
        acc.totalMinutes += parseInt(activity.duration) || 0;
      }
      if (activity.distance) {
        acc.totalDistance += parseFloat(activity.distance) || 0;
      }
      if (activity.elevation) {
        acc.totalElevation += parseInt(activity.elevation) || 0;
      }
      return acc;
    },
    { totalMinutes: 0, totalDistance: 0, totalElevation: 0 }
  );

  return (
    <div className="card activity-log">
      <div className="activity-header">
        <h3 className="card-title">Activity Log</h3>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          + Log Activity
        </button>
      </div>

      {activities.length > 0 && (
        <div className="stats-summary">
          <div className="stat">
            <span className="stat-value">{activities.length}</span>
            <span className="stat-label">Activities</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {Math.round(totalStats.totalMinutes / 60)}h{' '}
              {totalStats.totalMinutes % 60}m
            </span>
            <span className="stat-label">Total Time</span>
          </div>
          {totalStats.totalDistance > 0 && (
            <div className="stat">
              <span className="stat-value">
                {totalStats.totalDistance.toFixed(1)}km
              </span>
              <span className="stat-label">Distance</span>
            </div>
          )}
          {totalStats.totalElevation > 0 && (
            <div className="stat">
              <span className="stat-value">{totalStats.totalElevation}m</span>
              <span className="stat-label">Elevation</span>
            </div>
          )}
        </div>
      )}

      {isAdding && (
        <div className="activity-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Activity Type</label>
              <select
                className="form-select"
                value={newActivity.type}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, type: e.target.value })
                }
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={newActivity.date}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (minutes) *</label>
              <input
                className="form-input"
                type="number"
                value={newActivity.duration}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, duration: e.target.value })
                }
                placeholder="60"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Distance (km)</label>
              <input
                className="form-input"
                type="number"
                step="0.1"
                value={newActivity.distance}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, distance: e.target.value })
                }
                placeholder="5.0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Elevation (m)</label>
              <input
                className="form-input"
                type="number"
                value={newActivity.elevation}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, elevation: e.target.value })
                }
                placeholder="200"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={newActivity.notes}
              onChange={(e) =>
                setNewActivity({ ...newActivity, notes: e.target.value })
              }
              placeholder="How did it go? Any observations?"
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={addActivity}>
              Log Activity
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activities.length === 0 && !isAdding ? (
        <div className="empty-state" style={{ padding: '2rem 1rem' }}>
          <div className="empty-state-icon">🏃</div>
          <p>No activities logged yet. Start tracking your training!</p>
        </div>
      ) : (
        <div className="activities-list">
          {[...activities].reverse().map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDelete={onDeleteActivity}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityCard({ activity, onDelete }) {
  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <div>
          <span className="activity-type">{activity.type}</span>
          <span className="activity-date">
            {new Date(activity.date).toLocaleDateString()}
          </span>
        </div>
        <button
          className="btn-icon btn-danger"
          onClick={() => onDelete(activity.id)}
          title="Delete activity"
        >
          ×
        </button>
      </div>

      <div className="activity-details">
        <span className="activity-detail">
          ⏱️ {activity.duration} min
        </span>
        {activity.distance && (
          <span className="activity-detail">📏 {activity.distance} km</span>
        )}
        {activity.elevation && (
          <span className="activity-detail">⛰️ {activity.elevation} m</span>
        )}
      </div>

      {activity.notes && <p className="activity-notes">{activity.notes}</p>}
    </div>
  );
}

function TeamOverview({ trainingData, currentUser }) {
  const teamMembers = Object.entries(trainingData).filter(
    ([name]) => name !== currentUser
  );

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <div className="card team-overview">
      <h3 className="card-title">Team Progress</h3>
      <div className="team-members">
        {teamMembers.map(([name, data]) => {
          const activityCount = data.activities?.length || 0;
          const totalMinutes =
            data.activities?.reduce(
              (acc, a) => acc + (parseInt(a.duration) || 0),
              0
            ) || 0;

          return (
            <div key={name} className="team-member">
              <div className="team-member-header">
                <strong>{name}</strong>
                <span className="team-member-stats">
                  {activityCount} activities • {Math.round(totalMinutes / 60)}h{' '}
                  {totalMinutes % 60}m
                </span>
              </div>
              {data.goal && (
                <p className="team-member-goal">Goal: {data.goal}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
