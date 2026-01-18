import { useState, useEffect } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { database } from '../firebase/config';

/**
 * Custom hook for Firebase Realtime Database
 * Similar to useLocalStorage but syncs with Firebase
 *
 * @param {string} path - The database path (e.g., 'trekkers', 'tasks')
 * @param {any} initialValue - Initial value if nothing exists in database
 * @returns {[value, setValue, loading]} - Current value, setter function, and loading state
 */
export function useFirebase(path, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(database, path);

    // Subscribe to changes
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setValue(data !== null ? data : initialValue);
      setLoading(false);
    }, (error) => {
      console.error('Firebase read error:', error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => off(dbRef, 'value', unsubscribe);
  }, [path]);

  // Function to update Firebase
  const updateValue = async (newValue) => {
    try {
      const dbRef = ref(database, path);
      await set(dbRef, newValue);
      // setValue will be updated automatically via onValue listener
    } catch (error) {
      console.error('Firebase write error:', error);
    }
  };

  return [value, updateValue, loading];
}

/**
 * Hook for local-only storage (like current user name)
 * Keeps using localStorage for things that don't need to be synced
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
