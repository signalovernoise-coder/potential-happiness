import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Flights.css';

export default function Flights() {
  const [flights, setFlights] = useLocalStorage('trek-flights', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newFlight, setNewFlight] = useState({
    airline: '',
    flightNumber: '',
    departure: '',
    arrival: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
  });

  const addFlight = () => {
    if (!newFlight.airline.trim() || !newFlight.flightNumber.trim()) return;

    setFlights([
      ...flights,
      {
        ...newFlight,
        id: Date.now(),
        passengers: [],
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewFlight({
      airline: '',
      flightNumber: '',
      departure: '',
      arrival: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
    });
    setIsAdding(false);
  };

  const addPassenger = (flightId, passengerName) => {
    if (!passengerName.trim()) return;

    setFlights(
      flights.map((flight) => {
        if (flight.id === flightId) {
          const passengers = flight.passengers || [];
          if (!passengers.includes(passengerName)) {
            return { ...flight, passengers: [...passengers, passengerName] };
          }
        }
        return flight;
      })
    );
  };

  const removePassenger = (flightId, passengerName) => {
    setFlights(
      flights.map((flight) => {
        if (flight.id === flightId) {
          return {
            ...flight,
            passengers: flight.passengers.filter((name) => name !== passengerName),
          };
        }
        return flight;
      })
    );
  };

  const deleteFlight = (flightId) => {
    setFlights(flights.filter((flight) => flight.id !== flightId));
  };

  return (
    <div className="flights">
      <div className="flights-header">
        <h2 className="section-title">Flight Information</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          + Add Flight
        </button>
      </div>

      {isAdding && (
        <div className="card flight-form">
          <h3 className="card-title">New Flight</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Airline *</label>
              <input
                className="form-input"
                type="text"
                value={newFlight.airline}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, airline: e.target.value })
                }
                placeholder="e.g., Qantas"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Flight Number *</label>
              <input
                className="form-input"
                type="text"
                value={newFlight.flightNumber}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, flightNumber: e.target.value })
                }
                placeholder="e.g., QF123"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Departure City</label>
              <input
                className="form-input"
                type="text"
                value={newFlight.departure}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, departure: e.target.value })
                }
                placeholder="e.g., Melbourne"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Arrival City</label>
              <input
                className="form-input"
                type="text"
                value={newFlight.arrival}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, arrival: e.target.value })
                }
                placeholder="e.g., Hobart"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Departure Date</label>
              <input
                className="form-input"
                type="date"
                value={newFlight.departureDate}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, departureDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Departure Time</label>
              <input
                className="form-input"
                type="time"
                value={newFlight.departureTime}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, departureTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Arrival Date</label>
              <input
                className="form-input"
                type="date"
                value={newFlight.arrivalDate}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, arrivalDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Arrival Time</label>
              <input
                className="form-input"
                type="time"
                value={newFlight.arrivalTime}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, arrivalTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={addFlight}>
              Add Flight
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

      {flights.length === 0 && !isAdding ? (
        <div className="empty-state">
          <div className="empty-state-icon">✈️</div>
          <p>No flights added yet. Add your flight details!</p>
        </div>
      ) : (
        <div className="flights-grid">
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onAddPassenger={addPassenger}
              onRemovePassenger={removePassenger}
              onDelete={deleteFlight}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FlightCard({ flight, onAddPassenger, onRemovePassenger, onDelete }) {
  const [passengerName, setPassengerName] = useState('');

  const handleAddPassenger = () => {
    onAddPassenger(flight.id, passengerName);
    setPassengerName('');
  };

  return (
    <div className="card flight-card">
      <div className="flight-header">
        <div>
          <h3 className="flight-title">
            {flight.airline} {flight.flightNumber}
          </h3>
          {flight.departure && flight.arrival && (
            <p className="flight-route">
              {flight.departure} → {flight.arrival}
            </p>
          )}
        </div>
        <button
          className="btn-icon btn-danger"
          onClick={() => onDelete(flight.id)}
          title="Delete flight"
        >
          ×
        </button>
      </div>

      <div className="flight-details">
        {flight.departureDate && (
          <div className="flight-detail">
            <span className="detail-label">Departure:</span>
            <span className="detail-value">
              {new Date(flight.departureDate).toLocaleDateString()}
              {flight.departureTime && ` at ${flight.departureTime}`}
            </span>
          </div>
        )}
        {flight.arrivalDate && (
          <div className="flight-detail">
            <span className="detail-label">Arrival:</span>
            <span className="detail-value">
              {new Date(flight.arrivalDate).toLocaleDateString()}
              {flight.arrivalTime && ` at ${flight.arrivalTime}`}
            </span>
          </div>
        )}
      </div>

      {flight.passengers && flight.passengers.length > 0 && (
        <div className="passengers-list">
          <strong>Passengers:</strong>
          <div className="passengers">
            {flight.passengers.map((name) => (
              <span key={name} className="passenger-badge">
                {name}
                <button
                  className="remove-passenger"
                  onClick={() => onRemovePassenger(flight.id, name)}
                  title="Remove passenger"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="add-passenger">
        <input
          className="form-input"
          type="text"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          placeholder="Add passenger name"
          onKeyPress={(e) => e.key === 'Enter' && handleAddPassenger()}
        />
        <button className="btn btn-primary" onClick={handleAddPassenger}>
          Add
        </button>
      </div>
    </div>
  );
}
