// ═══════════════════════════════════════════════════
//  useLocalStorage — persistent state with localStorage
// ═══════════════════════════════════════════════════
import { useState, useCallback, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Keep key in a ref so setValue stays stable even if key changes
  const keyRef = useRef(key);
  keyRef.current = key;

  const setValue = useCallback((value) => {
    try {
      setStoredValue(prev => {
        const val = value instanceof Function ? value(prev) : value;
        try { localStorage.setItem(keyRef.current, JSON.stringify(val)); } catch {}
        return val;
      });
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }
  }, []);

  return [storedValue, setValue];
}
