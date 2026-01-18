import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
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

  // Toiletries
  { name: 'Travel towel (light and quick-dry)', category: 'Toiletries' },
  { name: 'Sunscreen', category: 'Toiletries' },
  { name: 'Insect repellent', category: 'Toiletries' },

  // Food & Water
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

  // Clothing - On the Track
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

  // Clothing - For Evenings
  { name: 'Warm jacket (down, fleece or woollen/merino)', category: 'Clothing - Evenings' },
  { name: 'Shirt (long or short-sleeved)', category: 'Clothing - Evenings' },
  { name: 'Warm, long pants', category: 'Clothing - Evenings' },
  { name: 'Lightweight footwear (thongs, sandals or crocs)', category: 'Clothing - Evenings' },

  // Safety
  { name: 'First Aid Kit (bandaids, blister packs, Elastoplast, gauze patches)', category: 'Safety' },
  { name: 'Compression bandage', category: 'Safety' },
  { name: 'Triangular bandage', category: 'Safety' },
  { name: 'Scissors, tweezers', category: 'Safety' },
  { name: 'Medications (antihistamine, anti-inflammatory, antiseptic cream, paracetamol)', category: 'Safety' },
  { name: 'Personal medication', category: 'Safety' },
  { name: 'Personal identification (licence or passport)', category: 'Safety' },

  // Optional Items
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
  { value: 'have', label: 'Have', color: 'success' },
  { value: 'borrow', label: 'Borrow', color: 'info' },
  { value: 'buy', label: 'Buy', color: 'warning' },
  { value: 'research', label: 'Research', color: 'secondary' },
];

export default function PackingList() {
  const [packingList, setPackingList] = useLocalStorage('trek-packing', []);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('');
  const [initialized, setInitialized] = useLocalStorage('trek-packing-initialized', false);

  // Initialize with official items on first load
  useEffect(() => {
    if (!initialized && packingList.length === 0) {
      const initialItems = OFFICIAL_ITEMS.map((item, index) => ({
        id: Date.now() + index,
        name: item.name,
        category: item.category,
        statuses: {}, // { personName: 'have' | 'borrow' | 'buy' | 'research' }
        createdAt: new Date().toISOString(),
      }));
      setPackingList(initialItems);
      setInitialized(true);
    }
  }, [initialized, packingList.length, setPackingList, setInitialized]);

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
        statuses: {},
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewItem('');
    setCategory('');
  };

  const updateStatus = (itemId, personName, status) => {
    if (!personName.trim()) return;

    setPackingList(
      packingList.map((item) => {
        if (item.id === itemId) {
          const statuses = { ...item.statuses };
          if (statuses[personName] === status) {
            delete statuses[personName];
          } else {
            statuses[personName] = status;
          }
          return { ...item, statuses };
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

  return (
    <div className="packing-list">
      <h2 className="section-title">Three Capes Track - Packing List</h2>

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
              <div className="items-list">
                {items.map((item) => (
                  <PackingItem
                    key={item.id}
                    item={item}
                    onUpdateStatus={updateStatus}
                    onDelete={deleteItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PackingItem({ item, onUpdateStatus, onDelete }) {
  const [personName, setPersonName] = useState('');
  const [showActions, setShowActions] = useState(false);

  const handleStatusClick = (status) => {
    if (!personName.trim()) {
      setShowActions(true);
      return;
    }
    onUpdateStatus(item.id, personName, status);
  };

  const statusEntries = Object.entries(item.statuses || {});

  return (
    <div className="packing-item">
      <div className="item-header">
        <span className="item-name">{item.name}</span>
        <button
          className="btn-icon btn-danger"
          onClick={() => onDelete(item.id)}
          title="Delete item"
        >
          ×
        </button>
      </div>

      {statusEntries.length > 0 && (
        <div className="status-badges">
          {statusEntries.map(([name, status]) => {
            const statusConfig = STATUS_OPTIONS.find((s) => s.value === status);
            return (
              <span key={name} className={`status-badge status-${statusConfig.color}`}>
                {name}: {statusConfig.label}
              </span>
            );
          })}
        </div>
      )}

      {showActions && (
        <div className="item-actions">
          <input
            className="form-input"
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Your name"
            onKeyPress={(e) => e.key === 'Enter' && setShowActions(false)}
          />
          <div className="status-buttons">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`btn btn-sm btn-status btn-${option.color}`}
                onClick={() => handleStatusClick(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!showActions && (
        <div className="quick-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowActions(true)}
          >
            Update Status
          </button>
        </div>
      )}
    </div>
  );
}
