import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatPoints(points: number): string {
  return points.toLocaleString("es-ES");
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function calculateLevel(exp: number): number {
  // Nivel basado en experiencia: cada nivel requiere 100 exp más que el anterior
  // Nivel 1: 0-99, Nivel 2: 100-299, Nivel 3: 300-599, etc.
  let level = 1;
  let requiredExp = 0;
  while (exp >= requiredExp) {
    requiredExp += level * 100;
    if (exp >= requiredExp) {
      level++;
    }
  }
  return level;
}

export function getExpForNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}

export function getExpProgress(exp: number, level: number): number {
  const expForCurrentLevel = (level - 1) * 100;
  const expForNextLevel = level * 100;
  const progress = exp - expForCurrentLevel;
  const totalNeeded = expForNextLevel - expForCurrentLevel;
  return Math.min(Math.max((progress / totalNeeded) * 100, 0), 100);
}

export function calculatePoints(
  correct: boolean,
  timeSeconds: number,
  streak: number
): number {
  if (!correct) return 0;

  let points = 10; // Base points

  // Speed bonus: faster = more points (max 10 bonus points)
  const maxTime = 30; // 30 seconds for max bonus
  const speedBonus = Math.max(0, Math.floor((maxTime - timeSeconds) / 3));
  points += Math.min(speedBonus, 10);

  // Streak bonus
  points += Math.floor(streak / 5) * 5;

  return points;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

