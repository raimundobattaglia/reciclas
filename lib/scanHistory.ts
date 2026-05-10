import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryEntry {
  barcode: string;
  name?: string;
  brand?: string;
  materials: string[];
  source: 'local' | 'openfoodfacts' | 'upcitemdb' | 'unknown';
  scannedAt: number;
}

const KEY = 'reciclas:history:v1';
const MAX_ENTRIES = 50;

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export async function addToHistory(entry: HistoryEntry): Promise<void> {
  try {
    const list = await getHistory();
    const filtered = list.filter((e) => e.barcode !== entry.barcode);
    const next = [entry, ...filtered].slice(0, MAX_ENTRIES);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}
