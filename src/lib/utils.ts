import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLevel(xp: number): number {
  // Level 1: 0-99, Level 2: 100-249, Level 3: 250-449, etc.
  // Formula: level = Math.floor(Math.sqrt(xp / 50)) + 1
  return Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
}

export function calculateNextLevelXp(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 50;
}

export function calculateLevelProgress(xp: number): { currentLevel: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  const currentLevel = calculateLevel(xp);
  const prevLevelXp = currentLevel > 1 ? Math.pow(currentLevel - 1, 2) * 50 : 0;
  const nextLevelXp = calculateNextLevelXp(currentLevel);
  const xpInCurrentLevel = xp - prevLevelXp;
  const xpNeededForLevel = nextLevelXp - prevLevelXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)));

  return {
    currentLevel,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpNeededForLevel,
    progressPercent,
  };
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
