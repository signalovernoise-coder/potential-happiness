import { useState } from 'react';
import Tasks from './components/Tasks';
import Flights from './components/Flights';
import PackingList from './components/PackingList';
import Chat from './components/Chat';
import Training from './components/Training';
import './App.css';

const TABS = [
  { id: 'tasks', label: 'Tasks & Bookings', component: Tasks },
  { id: 'flights', label: 'Flights', component: Flights },
  { id: 'packing', label: 'Packing List', component: PackingList },
  { id: 'chat', label: 'Chat', component: Chat },
  { id: 'training', label: 'Training', component: Training },
];

function App() {
  const [activeTab, setActiveTab] = useState('tasks');

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="app">
      <header className="header">
        <h1>🏔️ Tasmania Trek Planner</h1>
        <p>Three Capes Track Adventure</p>
      </header>

      <nav className="nav">
        <ul className="nav-tabs">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="main">
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}

export default App;
