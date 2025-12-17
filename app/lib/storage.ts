/**
 * Edge Config storage for leaderboard data
 * Uses Vercel Edge Config for global, persistent storage
 * All server instances share the same data instantly
 */

import { get } from '@vercel/edge-config';

interface LeaderboardEntry {
  address: string;
  username?: string;
  triggerPulls: number;
  deaths: number;
  maxStreak: number;
  rank?: number;
  isPaid?: boolean;
  lastPlayed?: number;
}

interface StorageData {
  leaderboard: {
    free: LeaderboardEntry[];
    paid: LeaderboardEntry[];
  };
  prizePool: {
    totalAmount: number;
    participants: number;
    lastUpdated: number;
  };
  playerStats: Record<string, any>;
}

// In-memory cache (syncs with Edge Config)
let cachedData: StorageData = {
  leaderboard: {
    free: [],
    paid: [],
  },
  prizePool: {
    totalAmount: 0,
    participants: 0,
    lastUpdated: Date.now(),
  },
  playerStats: {},
};

let lastFetch = 0;
const CACHE_TTL = 30000; // 30 seconds cache

/**
 * Load data from Edge Config
 */
export async function loadData(): Promise<StorageData> {
  try {
    const now = Date.now();
    
    // Use cache if fresh (30s TTL)
    if (now - lastFetch < CACHE_TTL) {
      console.log('📦 Using cached data (fresh)');
      return cachedData;
    }
    
    // Fetch from Edge Config
    const data = await get<StorageData>('game-data');
    
    if (data) {
      cachedData = data;
      lastFetch = now;
      console.log('🌐 Loaded data from Edge Config:', {
        freeLeaderboard: data.leaderboard?.free?.length || 0,
        paidLeaderboard: data.leaderboard?.paid?.length || 0,
        playerStats: Object.keys(data.playerStats || {}).length,
        prizePool: data.prizePool?.totalAmount || 0
      });
      return data;
    } else {
      // First time - initialize with empty data
      console.log('⚠️ No data in Edge Config yet, initializing...');
      await saveData(cachedData);
      return cachedData;
    }
  } catch (error) {
    console.log('⚠️ Edge Config error, using cache:', error instanceof Error ? error.message : 'Unknown');
    return cachedData;
  }
}

/**
 * Save data to Edge Config
 */
export async function saveData(data: StorageData): Promise<void> {
  // Update cache immediately
  cachedData = data;
  lastFetch = Date.now();
  
  try {
    // Save to Edge Config via API endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/update-edge-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'game-data', value: data }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to save to Edge Config:', error);
    } else {
      console.log('💾 Saved data to Edge Config:', {
        freeLeaderboard: data.leaderboard?.free?.length || 0,
        paidLeaderboard: data.leaderboard?.paid?.length || 0,
        playerStats: Object.keys(data.playerStats || {}).length,
      });
    }
  } catch (error) {
    console.log('⚠️ Could not save to Edge Config:', error instanceof Error ? error.message : 'Unknown');
  }
}

/**
 * Get current data (from cache)
 */
export function getData(): StorageData {
  console.log('📊 getData called - current cache:', {
    freeLeaderboard: cachedData.leaderboard?.free?.length || 0,
    paidLeaderboard: cachedData.leaderboard?.paid?.length || 0,
    playerStats: Object.keys(cachedData.playerStats || {}).length
  });
  return cachedData;
}

/**
 * Update leaderboard entry
 */
export async function updateLeaderboardEntry(
  mode: 'free' | 'paid',
  entry: LeaderboardEntry
): Promise<void> {
  const data = getData();
  const board = data.leaderboard[mode];
  
  // Remove existing entry
  const index = board.findIndex(
    (e) => e.address.toLowerCase() === entry.address.toLowerCase()
  );
  if (index >= 0) {
    board.splice(index, 1);
  }
  
  // Add new entry
  board.push(entry);
  
  // Sort by maxStreak (desc), then trigger pulls (desc), then deaths (asc)
  board.sort((a, b) => {
    if (b.maxStreak !== a.maxStreak) {
      return b.maxStreak - a.maxStreak;
    }
    if (b.triggerPulls !== a.triggerPulls) {
      return b.triggerPulls - a.triggerPulls;
    }
    return a.deaths - b.deaths;
  });
  
  // Update ranks
  board.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });
  
  await saveData(data);
}

/**
 * Update player stats
 */
export async function updatePlayerStats(
  address: string,
  stats: any
): Promise<void> {
  const data = getData();
  data.playerStats[address] = {
    ...data.playerStats[address],
    ...stats,
    lastUpdated: Date.now(),
  };
  
  await saveData(data);
}

/**
 * Get player stats
 */
export function getPlayerStats(address: string): any {
  const data = getData();
  return data.playerStats[address] || null;
}

/**
 * Update prize pool
 */
export async function updatePrizePool(update: {
  totalAmount?: number;
  participants?: number;
}): Promise<void> {
  const data = getData();
  data.prizePool = {
    ...data.prizePool,
    ...update,
    lastUpdated: Date.now(),
  };
  
  await saveData(data);
}

/**
 * Initialize storage (call on server startup)
 */
export async function initStorage(): Promise<void> {
  await loadData();
}


