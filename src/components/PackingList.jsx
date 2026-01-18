import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './PackingList.css';

export default function PackingList() {
  const [packingList, setPackingList] = useLocalStorage('trek-packing', []);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'Clothing',
    'Gear',
    'Food & Water',
    'First Aid',
    'Navigation',
    'Personal',
    'Other',
  ];

  const addItem = () => {
    if (!newItem.trim()) return;

    setPackingList([
      ...packingList,
      {
        id: Date.now(),
        name: newItem,
        category: category || 'Other',
        packedBy: [],
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewItem('');
    setCategory('');
  };

  const togglePacked = (itemId, personName) => {
    if (!personName.trim()) return;

    setPackingList(
      packingList.map((item) => {
        if (item.id === itemId) {
          const packedBy = item.packedBy || [];
          const isPacked = packedBy.includes(personName);

          return {
            ...item,
            packedBy: isPacked
              ? packedBy.filter((name) => name !== personName)
              : [...packedBy, personName],
          };
        }
        return item;
      })
    );
  };

  const deleteItem = (itemId) => {
    setPackingList(packingList.filter((item) => item.id !== itemId));
  };

  const groupedItems = packingList.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="packing-list">
      <h2 className="section-title">Packing List</h2>

      <div className="card add-item-form">
        <div className="form-group">
          <label className="form-label">Add Item</label>
          <div className="add-item-row">
            <input
              className="form-input"
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="e.g., Hiking boots, Water bottle"
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
          <p>Your packing list is empty. Start adding items!</p>
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
                    onToggle={togglePacked}
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

function PackingItem({ item, onToggle, onDelete }) {
  const [personName, setPersonName] = useState('');

  const handleToggle = () => {
    onToggle(item.id, personName);
    setPersonName('');
  };

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

      {item.packedBy && item.packedBy.length > 0 && (
        <div className="packed-by">
          {item.packedBy.map((name) => (
            <span key={name} className="packed-badge">
              ✓ {name}
            </span>
          ))}
        </div>
      )}

      <div className="item-actions">
        <input
          className="form-input"
          type="text"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Your name"
          onKeyPress={(e) => e.key === 'Enter' && handleToggle()}
        />
        <button className="btn btn-primary btn-sm" onClick={handleToggle}>
          Packed
        </button>
      </div>
    </div>
  );
}
