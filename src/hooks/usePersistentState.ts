import { useEffect, useState } from 'react';
import { loadItem, saveItem } from '../services/storage';

export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => loadItem(key, initial));
  useEffect(() => saveItem(key, value), [key, value]);
  return [value, setValue] as const;
}
