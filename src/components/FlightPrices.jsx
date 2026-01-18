import { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import './FlightPrices.css';

const SEARCH_LINKS = [
  {
    name: 'Google Flights',
    url: 'https://www.google.com/travel/flights?q=flights%20from%20brisbane%20to%20hobart%20on%202026-03-17%20returning%202026-03-22',
  },
  {
    name: 'Skyscanner',
    url: 'https://www.skyscanner.com.au/transport/flights/bne/hba/260317/260322/',
  },
];

export default function FlightPrices() {
  const [priceHistory, setPriceHistory, loading] = useFirebase('flight-prices', []);
  const [newPrice, setNewPrice] = useState({
    price: '',
    airline: '',
    route: 'BNE → HBA',
    notes: '',
  });

  const addPrice = () => {
    if (!newPrice.price || !newPrice.airline) return;

    setPriceHistory([
      {
        id: Date.now(),
        ...newPrice,
        price: parseFloat(newPrice.price),
        date: new Date().toISOString(),
      },
      ...priceHistory,
    ]);

    setNewPrice({
      price: '',
      airline: '',
      route: 'BNE → HBA',
      notes: '',
    });
  };

  const deletePrice = (id) => {
    setPriceHistory(priceHistory.filter((p) => p.id !== id));
  };

  const lowestPrice = priceHistory.length > 0
    ? Math.min(...priceHistory.map((p) => p.price))
    : null;

  const averagePrice = priceHistory.length > 0
    ? priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length
    : null;

  if (loading) {
    return (
      <div className="flight-prices">
        <div className="loading-state">
          <div className="loading-icon">⏳</div>
          <p>Loading flight prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-prices">
      <h2 className="section-title">Flight Price Tracker</h2>
      <p className="subtitle">Brisbane ✈️ Hobart | March 17-22, 2026</p>

      <div className="card">
        <h3 className="card-title">Quick Search Links</h3>
        <p className="search-subtitle">
          These are the most reliable flight search engines that work well for Australian domestic flights
        </p>
        <div className="search-links">
          {SEARCH_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="search-link"
            >
              {link.name} →
            </a>
          ))}
        </div>
      </div>

      {priceHistory.length > 0 && (
        <div className="card price-stats">
          <h3 className="card-title">Price Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Lowest Price</div>
              <div className="stat-value">${lowestPrice.toFixed(0)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Average Price</div>
              <div className="stat-value">${averagePrice.toFixed(0)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Tracked Flights</div>
              <div className="stat-value">{priceHistory.length}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">Add Flight Price</h3>
        <div className="price-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (AUD)</label>
              <input
                className="form-input"
                type="number"
                value={newPrice.price}
                onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                placeholder="e.g., 350"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Airline</label>
              <input
                className="form-input"
                type="text"
                value={newPrice.airline}
                onChange={(e) => setNewPrice({ ...newPrice, airline: e.target.value })}
                placeholder="e.g., Qantas, Virgin"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Route</label>
              <select
                className="form-select"
                value={newPrice.route}
                onChange={(e) => setNewPrice({ ...newPrice, route: e.target.value })}
              >
                <option value="BNE → HBA">Brisbane → Hobart (Direct)</option>
                <option value="BNE → MEL → HBA">Brisbane → Melbourne → Hobart</option>
                <option value="BNE → SYD → HBA">Brisbane → Sydney → Hobart</option>
                <option value="HBA → BNE">Hobart → Brisbane (Return)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input
                className="form-input"
                type="text"
                value={newPrice.notes}
                onChange={(e) => setNewPrice({ ...newPrice, notes: e.target.value })}
                placeholder="e.g., Baggage included, Sale price"
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={addPrice}>
            Add Price
          </button>
        </div>
      </div>

      {priceHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <p>No flights tracked yet. Start adding prices you find!</p>
        </div>
      ) : (
        <div className="price-history">
          <h3 className="section-subtitle">Price History</h3>
          <div className="prices-list">
            {priceHistory.map((entry) => (
              <div key={entry.id} className="price-entry">
                <div className="price-header">
                  <div className="price-main">
                    <span className="price-amount">${entry.price.toFixed(0)}</span>
                    <span className="price-airline">{entry.airline}</span>
                  </div>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => deletePrice(entry.id)}
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
                <div className="price-details">
                  <span className="price-route">Route: {entry.route}</span>
                  <span className="price-date">
                    Added: {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                {entry.notes && (
                  <div className="price-notes">{entry.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
