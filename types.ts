export interface PlayerData {
  player: string;
  price: number;
  points: number;
}

export interface FirebaseTeamData {
  players: PlayerData[];
  totalSpent: number;
  remainingBudget: number;
}

export interface PlayerImageInfo {
  name: string;
  image: string | null;
}

// Specific roles for display
export type PlayerRole = 'Batter' | 'Bowler' | 'All-Rounder';

export interface EnrichedPlayer extends PlayerData {
  image: string;
  role: PlayerRole;
  isOverseas?: boolean;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
}