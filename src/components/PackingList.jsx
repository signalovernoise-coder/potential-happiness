import { useState, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import './PackingList.css';

// Official Three Capes Track Packing List
const OFFICIAL_ITEMS = [
  // Essentials
  { name: 'Backpack (capacity around 50 litres)', category: 'Essentials' },
  { name: 'Backpack liner (to keep everything dry)', category: 'Essentials' },
  { name: 'Day pack (lightweight, packs down to fist-size)', category: 'Essentials' },
  { name: 'Concession card (if applicable)', category: 'Essentials' },
  { name: 'Hiking shoes or boots (water resistant, sturdy soles)', category: 'Essentials' },
  { name: 'Sleeping bag (rated to -5°C)', category: 'Essentials' },
  { name: 'Sleeping bag liner', category: 'Essentials' },
  { name: 'Handheld or head torch (with spare batteries)', category: 'Essentials' },
  { name: 'Ear plugs', category: 'Essentials' },
  { name: 'Personal toiletries (toothpaste, toothbrush, deodorant, moisturiser)', category: 'Essentials' },
  { name: 'Toilet paper and trowel', category: 'Essentials' },
  { name: 'Travel towel (light and quick-dry)', category: 'Toiletries' },
  { name: 'Sunscreen', category: 'Toiletries' },
  { name: 'Insect repellent', category: 'Toiletries' },
  { name: 'Water bottle(s) or water bladder (2 litre total capacity)', category: 'Food & Water' },
  { name: 'Lightweight crockery and cutlery (bowl, plate, knife, fork, spoon, mug)', category: 'Food & Water' },
  { name: 'Pocket knife', category: 'Food & Water' },
  { name: '3 breakfast meals', category: 'Food & Water' },
  { name: '4 lunch meals', category: 'Food & Water' },
  { name: '3 dinner meals', category: 'Food & Water' },
  { name: 'Snacks (dried fruit, nuts, muesli bars, chocolate)', category: 'Food & Water' },
  { name: 'Hot drinks (tea, coffee, hot chocolate, instant soup)', category: 'Food & Water' },
  { name: 'Tea towel', category: 'Food & Water' },
  { name: 'Rubbish bags', category: 'Food & Water' },
  { name: 'Rain jacket with hood (waterproof, windproof, breathable)', category: 'Clothing - On Track' },
  { name: 'Overpants (waterproof, windproof, breathable)', category: 'Clothing - On Track' },
  { name: 'Light jacket (fleece or woollen/merino)', category: 'Clothing - On Track' },
  { name: 'Walking trousers or shorts (quick-dry fabric, not denim)', category: 'Clothing - On Track' },
  { name: 'Walking shirt (long or short-sleeved, quick-dry fabric)', category: 'Clothing - On Track' },
  { name: 'Thermals (long-sleeve top & leggings, merino or polyprop)', category: 'Clothing - On Track' },
  { name: 'Socks', category: 'Clothing - On Track' },
  { name: 'Underwear', category: 'Clothing - On Track' },
  { name: 'Beanie', category: 'Clothing - On Track' },
  { name: 'Gloves', category: 'Clothing - On Track' },
  { name: 'Sun hat', category: 'Clothing - On Track' },
  { name: 'Sunglasses', category: 'Clothing - On Track' },
  { name: 'Warm jacket (down, fleece or woollen/merino)', category: 'Clothing - Evenings' },
  { name: 'Shirt (long or short-sleeved)', category: 'Clothing - Evenings' },
  { name: 'Warm, long pants', category: 'Clothing - Evenings' },
  { name: 'Lightweight footwear (thongs, sandals or crocs)', category: 'Clothing - Evenings' },
  { name: 'First Aid Kit (bandaids, blister packs, Elastoplast, gauze patches)', category: 'Safety' },
  { name: 'Compression bandage', category: 'Safety' },
  { name: 'Triangular bandage', category: 'Safety' },
  { name: 'Scissors, tweezers', category: 'Safety' },
  { name: 'Medications (antihistamine, anti-inflammatory, antiseptic cream, paracetamol)', category: 'Safety' },
  { name: 'Personal medication', category: 'Safety' },
  { name: 'Personal identification (licence or passport)', category: 'Safety' },
  { name: 'Mobile phone', category: 'Optional' },
  { name: 'Dry bags for spare clothes and sleeping bag', category: 'Optional' },
  { name: 'Thermos flask for hot drink on the track', category: 'Optional' },
  { name: 'Walking poles', category: 'Optional' },
  { name: 'Camera (and spare batteries or USB power cord)', category: 'Optional' },
  { name: 'Binoculars (to see albatross, eagles, whales and seals!)', category: 'Optional' },
  { name: 'Bathers (beaches at start and end of walk)', category: 'Optional' },
  { name: 'Book/journal', category: 'Optional' },
];

const STATUS_OPTIONS = [
  { value: 'have', label: 'Have', emoji: '✓', color: 'success' },
  { value: 'borrow', label: 'Borrow', emoji: '🤝', color: 'info' },
  { value: 'buy', label: 'Buy', emoji: '🛒', color: 'warning' },
  { value: 'research', label: 'Research', emoji: '🔍', color: 'secondary' },
];

export default function PackingList({ trekkerName }) {
  const [packingList, setPackingList, loading] = useFirebase('packing-items', []);
  const [trekkers] = useFirebase('trekkers', []);
  const [selectedTrekker, setSelectedTrekker] = useState(trekkerName || '');
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  // Initialize with official items on first load
  useEffect(() => {
    if (!loading && !initialized && packingList.length === 0) {
      const initialItems = OFFICIAL_ITEMS.map((item, index) => ({
        id: Date.now() + index,
        name: item.name,
        category: item.category,
        trekkerStatuses: {}, // { trekkerName: 'have' | 'borrow' | 'buy' | 'research' }
        createdAt: new Date().toISOString(),
      }));
      setPackingList(initialItems);
      setInitialized(true);
    }
  }, [loading, initialized, packingList.length, setPackingList]);

  // Set selected trekker when trekkerName prop changes
  useEffect(() => {
    if (trekkerName) {
      setSelectedTrekker(trekkerName);
    }
  }, [trekkerName]);

  const categories = [
    ...new Set([
      'Essentials',
      'Toiletries',
      'Food & Water',
      'Clothing - On Track',
      'Clothing - Evenings',
      'Safety',
      'Optional',
      ...packingList.map((item) => item.category),
    ]),
  ];

  const addItem = () => {
    if (!newItem.trim()) return;

    setPackingList([
      ...packingList,
      {
        id: Date.now(),
        name: newItem,
        category: category || 'Optional',
        trekkerStatuses: {},
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewItem('');
    setCategory('');
  };

  const updateStatus = (itemId, status) => {
    if (!selectedTrekker) return;

    setPackingList(
      packingList.map((item) => {
        if (item.id === itemId) {
          const trekkerStatuses = { ...item.trekkerStatuses };
          if (trekkerStatuses[selectedTrekker] === status) {
            delete trekkerStatuses[selectedTrekker];
          } else {
            trekkerStatuses[selectedTrekker] = status;
          }
          return { ...item, trekkerStatuses };
        }
        return item;
      })
    );
  };

  const deleteItem = (itemId) => {
    setPackingList(packingList.filter((item) => item.id !== itemId));
  };

  const groupedItems = packingList.reduce((acc, item) => {
    const cat = item.category || 'Optional';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Get shopping list items (items marked as 'buy' for selected trekker)
  const shoppingList = packingList.filter(
    (item) => selectedTrekker && item.trekkerStatuses[selectedTrekker] === 'buy'
  );

  if (loading) {
    return (
      <div className="packing-list">
        <div className="loading-state">
          <div className="loading-icon">⏳</div>
          <p>Loading packing list...</p>
        </div>
      </div>
    );
  }

  if (showPrintView) {
    return (
      <div className="packing-list print-view">
        <div className="print-header">
          <h2>Shopping List for {selectedTrekker}</h2>
          <p>Three Capes Track - March 17, 2026</p>
          <button className="btn btn-outline no-print" onClick={() => setShowPrintView(false)}>
            ← Back to Packing List
          </button>
          <button className="btn btn-primary no-print" onClick={() => window.print()}>
            🖨️ Print
          </button>
        </div>

        <div className="shopping-list-print">
          {shoppingList.length === 0 ? (
            <p>No items marked for purchase.</p>
          ) : (
            <ul className="shopping-items">
              {shoppingList.map((item) => (
                <li key={item.id} className="shopping-item">
                  <span className="checkbox-print">☐</span>
                  <span className="item-name-print">{item.name}</span>
                  <span className="category-print">({item.category})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="packing-list">
      <div className="packing-header">
        <div>
          <h2 className="section-title">
            {trekkerName ? `${trekkerName}'s Packing List` : 'Three Capes Track - Packing List'}
          </h2>
          <p className="packing-subtitle">Track your gear preparation</p>
        </div>
        <div className="packing-actions">
          {!trekkerName && (
            <select
              className="form-select trekker-select"
              value={selectedTrekker}
              onChange={(e) => setSelectedTrekker(e.target.value)}
            >
              <option value="">Select a trekker</option>
              {trekkers.map((trekker) => (
                <option key={trekker.name} value={trekker.name}>
                  {trekker.avatar} {trekker.name}
                </option>
              ))}
            </select>
          )}
          {selectedTrekker && shoppingList.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowPrintView(true)}
            >
              🛒 Shopping List ({shoppingList.length})
            </button>
          )}
        </div>
      </div>

      {!selectedTrekker ? (
        <div className="card user-selection">
          <h3 className="card-title">Select a Trekker</h3>
          <p className="user-selection-subtitle">
            Choose a trekker from the dropdown above to view their packing status
          </p>
        </div>
      ) : (
        <>
          <div className="status-legend">
            {STATUS_OPTIONS.map((option) => (
              <div key={option.value} className="legend-item">
                <span className={`legend-badge status-${option.color}`}>
                  {option.emoji}
                </span>
                <span className="legend-label">{option.label}</span>
              </div>
            ))}
          </div>

          <div className="card add-item-form">
            <div className="form-group">
              <label className="form-label">Add Custom Item</label>
              <div className="add-item-row">
                <input
                  className="form-input"
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="e.g., Hiking poles, Extra snacks"
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                />
                <select
                  className="form-select category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={addItem}>
                  Add
                </button>
              </div>
            </div>
          </div>

          {packingList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎒</div>
              <p>Loading official packing list...</p>
            </div>
          ) : (
            <div className="categories">
              {Object.entries(groupedItems).map(([cat, items]) => (
                <div key={cat} className="category-section">
                  <h3 className="category-title">
                    {cat} ({items.length})
                  </h3>
                  <div className="items-grid">
                    {items.map((item) => (
                      <PackingItemGrid
                        key={item.id}
                        item={item}
                        selectedTrekker={selectedTrekker}
                        trekkers={trekkers}
                        onUpdateStatus={updateStatus}
                        onDelete={deleteItem}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PackingItemGrid({ item, selectedTrekker, trekkers, onUpdateStatus, onDelete }) {
  const currentStatus = item.trekkerStatuses?.[selectedTrekker];
  const otherStatuses = Object.entries(item.trekkerStatuses || {}).filter(
    ([name]) => name !== selectedTrekker
  );

  return (
    <div className="packing-item-grid">
      <div className="item-header-grid">
        <span className="item-name-grid">{item.name}</span>
        <button
          className="btn-icon-small btn-danger"
          onClick={() => onDelete(item.id)}
          title="Delete item"
        >
          ×
        </button>
      </div>

      <div className="status-buttons-grid">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`status-btn ${
              currentStatus === option.value ? `active status-${option.color}` : ''
            }`}
            onClick={() => onUpdateStatus(item.id, option.value)}
            title={option.label}
          >
            <span className="status-emoji">{option.emoji}</span>
          </button>
        ))}
      </div>

      {otherStatuses.length > 0 && (
        <div className="other-statuses">
          {otherStatuses.map(([name, status]) => {
            const statusConfig = STATUS_OPTIONS.find((s) => s.value === status);
            const trekker = trekkers.find((t) => t.name === name);
            return (
              <span key={name} className="other-status-badge" title={`${name}: ${statusConfig.label}`}>
                {trekker?.avatar || '👤'} {name}: {statusConfig.emoji}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
