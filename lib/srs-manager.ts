import AsyncStorage from '@react-native-async-storage/async-storage';

const SRS_KEY = '@horizon_bilingue_srs';

export type SRSItem = {
  id: string;
  type: 'letter' | 'word';
  text: string;
  latin?: string;
  interval: number;
  ease: number;
  repetitions: number;
  nextReview: number;
  lastReview: number;
  lapses: number;
};

export type SRSData = {
  items: SRSItem[];
  lastSync: number;
};

const defaultSRSData: SRSData = { items: [], lastSync: Date.now() };

export async function loadSRSData(): Promise<SRSData> {
  try {
    const json = await AsyncStorage.getItem(SRS_KEY);
    if (json) return JSON.parse(json);
  } catch (e) {
    console.error('[SRS] Load error:', e);
  }
  return defaultSRSData;
}

export async function saveSRSData(data: SRSData): Promise<void> {
  try {
    await AsyncStorage.setItem(SRS_KEY, JSON.stringify({ ...data, lastSync: Date.now() }));
  } catch (e) {
    console.error('[SRS] Save error:', e);
  }
}

export function applySM2(
  item: SRSItem,
  quality: 1 | 3 | 5,
): SRSItem {
  const now = Date.now();
  const updated = { ...item, lastReview: now };

  if (quality >= 3) {
    if (updated.repetitions === 0) updated.interval = 1;
    else if (updated.repetitions === 1) updated.interval = 6;
    else updated.interval = Math.round(updated.interval * updated.ease);
    updated.repetitions += 1;
  } else {
    updated.repetitions = 0;
    updated.interval = 1;
    updated.lapses += 1;
    updated.ease = Math.max(1.3, updated.ease - 0.2);
  }

  updated.ease = Math.max(
    1.3,
    updated.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  updated.nextReview = now + updated.interval * 24 * 60 * 60 * 1000;
  return updated;
}

export function createSRSItem(
  type: 'letter' | 'word',
  text: string,
  latin?: string,
): SRSItem {
  return {
    id: `${type}:${text}`,
    type,
    text,
    latin,
    interval: 0,
    ease: 2.5,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: 0,
    lapses: 0,
  };
}

export async function addItemsToSRS(items: SRSItem[]): Promise<void> {
  const data = await loadSRSData();
  const existing = new Map(data.items.map((i) => [i.id, i]));
  for (const item of items) {
    if (!existing.has(item.id)) existing.set(item.id, item);
  }
  data.items = Array.from(existing.values());
  await saveSRSData(data);
}

export async function reviewSRSItem(
  id: string,
  quality: 1 | 3 | 5,
): Promise<SRSItem | null> {
  const data = await loadSRSData();
  const idx = data.items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  data.items[idx] = applySM2(data.items[idx], quality);
  await saveSRSData(data);
  return data.items[idx];
}

export async function getDueSRSCount(): Promise<number> {
  const data = await loadSRSData();
  const now = Date.now();
  return data.items.filter((i) => i.nextReview <= now).length;
}

export async function getDueSRSItems(): Promise<SRSItem[]> {
  const data = await loadSRSData();
  const now = Date.now();
  return data.items
    .filter((i) => i.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
}

export async function getSRSStats(): Promise<{
  total: number;
  due: number;
  mastered: number;
  learning: number;
}> {
  const data = await loadSRSData();
  const now = Date.now();
  const total = data.items.length;
  const due = data.items.filter((i) => i.nextReview <= now).length;
  const mastered = data.items.filter((i) => i.interval >= 21).length;
  const learning = total - mastered;
  return { total, due, mastered, learning };
}
