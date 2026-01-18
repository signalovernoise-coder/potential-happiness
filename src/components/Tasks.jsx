import { useState, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import './Tasks.css';

const PREDEFINED_TASKS = [
  { id: 'walk-booked', title: 'Walk Booked', description: 'Book your spot on the Three Capes Track' },
  { id: 'flights-booked', title: 'Flights Booked', description: 'Book flights to/from Hobart' },
  { id: 'accommodation-booked', title: 'Accommodation Booked', description: 'Book pre/post trek accommodation' },
  { id: 'coach-booked', title: 'Coach Booked', description: 'Book coach transfer to/from track' },
  { id: 'packed', title: 'Packed', description: 'All gear packed and ready to go!' },
];

export default function Tasks({ trekkerName }) {
  const [tasks, setTasks, loading] = useFirebase(
    trekkerName ? `tasks/${trekkerName}` : 'tasks/shared',
    []
  );
  const [trekkers] = useFirebase('trekkers', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  // Initialize with predefined tasks if empty
  useEffect(() => {
    if (!loading && !initialized && tasks.length === 0) {
      const initialTasks = PREDEFINED_TASKS.map((task) => ({
        ...task,
        completedBy: [],
        createdAt: new Date().toISOString(),
        isPredefined: true,
      }));
      setTasks(initialTasks);
      setInitialized(true);
    }
  }, [loading, initialized, tasks.length, setTasks]);

  const addTask = () => {
    if (!newTask.title.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        completedBy: [],
        createdAt: new Date().toISOString(),
        isPredefined: false,
      },
    ]);

    setNewTask({ title: '', description: '', dueDate: '' });
    setShowAddForm(false);
  };

  const toggleComplete = (taskId, personName) => {
    if (!personName.trim()) return;

    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const completedBy = task.completedBy || [];
          const isCompleted = completedBy.includes(personName);

          return {
            ...task,
            completedBy: isCompleted
              ? completedBy.filter((name) => name !== personName)
              : [...completedBy, personName],
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  if (loading) {
    return (
      <div className="tasks">
        <div className="loading-state">
          <div className="loading-icon">⏳</div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks">
      <div className="tasks-header">
        <div>
          <h2 className="section-title">
            {trekkerName ? `${trekkerName}'s Tasks` : 'Group Tasks & Bookings'}
          </h2>
          <p className="tasks-subtitle">
            Track your trek preparation tasks and bookings
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Custom Task'}
        </button>
      </div>

      {showAddForm && (
        <div className="card task-form">
          <h3 className="card-title">Add Custom Task</h3>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              className="form-input"
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="e.g., Buy hiking boots"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Additional details..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              className="form-input"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={addTask}>
              Add Task
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setShowAddForm(false);
                setNewTask({ title: '', description: '', dueDate: '' });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="tasks-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            trekkers={trekkers}
            trekkerName={trekkerName}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, trekkers, trekkerName, onToggleComplete, onDelete }) {
  const [selectedPerson, setSelectedPerson] = useState('');
  const completedCount = (task.completedBy || []).length;
  const totalTrekkers = trekkers.length;

  const handleToggle = () => {
    const nameToUse = trekkerName || selectedPerson;
    if (nameToUse) {
      onToggleComplete(task.id, nameToUse);
      setSelectedPerson('');
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isCompleted = trekkerName && task.completedBy?.includes(trekkerName);

  return (
    <div className={`card task-card ${task.isPredefined ? 'predefined-task' : ''}`}>
      <div className="task-header">
        <div className="task-title-section">
          <h3 className="task-title">{task.title}</h3>
          {task.isPredefined && (
            <span className="predefined-badge">Required</span>
          )}
        </div>
        {!task.isPredefined && (
          <button
            className="btn-icon btn-danger"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            ×
          </button>
        )}
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.dueDate && (
        <p className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
          {isOverdue && ' (Overdue!)'}
        </p>
      )}

      {completedCount > 0 && (
        <div className="task-completed">
          <strong>Completed by ({completedCount}/{totalTrekkers || '?'}):</strong>
          <div className="completed-names">
            {task.completedBy.map((name) => (
              <span key={name} className="completed-badge">
                ✓ {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="task-actions">
        {!trekkerName && (
          <select
            className="form-select"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">Select your name</option>
            {trekkers.map((trekker) => (
              <option key={trekker.name} value={trekker.name}>
                {trekker.avatar} {trekker.name}
              </option>
            ))}
          </select>
        )}
        <button
          className="btn btn-primary btn-sm"
          onClick={handleToggle}
          disabled={!trekkerName && !selectedPerson}
        >
          {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
}
