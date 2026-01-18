import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage('trek-tasks', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;

    setTasks([
      ...tasks,
      {
        ...newTask,
        id: Date.now(),
        completed: false,
        completedBy: [],
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
    setIsAdding(false);
  };

  const toggleTaskCompletion = (taskId, personName) => {
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

  return (
    <div className="tasks">
      <div className="tasks-header">
        <h2 className="section-title">Tasks & Bookings</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          + Add Task
        </button>
      </div>

      {isAdding && (
        <div className="card task-form">
          <h3 className="card-title">New Task</h3>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              className="form-input"
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              placeholder="e.g., Book accommodation"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Add details about this task..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              className="form-input"
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={addTask}>
              Add Task
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

      {tasks.length === 0 && !isAdding ? (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onToggle, onDelete }) {
  const [personName, setPersonName] = useState('');

  const handleToggle = () => {
    onToggle(task.id, personName);
    setPersonName('');
  };

  return (
    <div className="card task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <button
          className="btn-icon btn-danger"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="task-due-date">
          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {task.completedBy && task.completedBy.length > 0 && (
        <div className="task-completed">
          <strong>Completed by:</strong>
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
        <input
          className="form-input"
          type="text"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Your name"
          onKeyPress={(e) => e.key === 'Enter' && handleToggle()}
        />
        <button className="btn btn-primary" onClick={handleToggle}>
          Mark Done
        </button>
      </div>
    </div>
  );
}
