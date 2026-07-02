import { useState } from 'react';

/**
 * File Explanation: useLocalStorage.jsx
 * 
 * A custom React state hook that reads and writes state variables directly to the 
 * browser's local storage database, allowing persistence of mock SaaS data.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`LocalStorage Read Error for key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`LocalStorage Write Error for key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
