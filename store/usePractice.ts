"use client";

import { create } from "zustand";
import type { Exercise, ExerciseType } from "@/lib/types";
import { getExercises, savePartida, updateUserStats } from "@/lib/supabase";
import { calculatePoints } from "@/lib/utils";
import { useSession } from "./useSession";

interface PracticeState {
  exercises: Exercise[];
  currentIndex: number;
  score: number;
  correctCount: number;
  totalTime: number;
  startTime: number | null;
  isFinished: boolean;
  results: Array<{
    exerciseId: string;
    correct: boolean;
    time: number;
    points: number;
    tipo: ExerciseType;
  }>;
  currentExercise: Exercise | null;
  loading: boolean;
  error: string | null;
  loadExercises: (types: ExerciseType[], limit?: number) => Promise<void>;
  validateAnswer: (answer: string) => boolean;
  nextQuestion: () => Promise<void>;
  finishPractice: () => Promise<void>;
  reset: () => void;
  startTimer: () => void;
  getCurrentTime: () => number;
}

export const usePractice = create<PracticeState>((set, get) => ({
  exercises: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  totalTime: 0,
  startTime: null,
  isFinished: false,
  results: [],
  currentExercise: null,
  loading: false,
  error: null,

  loadExercises: async (types: ExerciseType[], limit: number = 10) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await getExercises(types, limit);
      if (error) {
        set({ error: error.message, loading: false });
        return;
      }

      const exercises = data as Exercise[];
      set({
        exercises,
        currentIndex: 0,
        currentExercise: exercises[0] || null,
        score: 0,
        correctCount: 0,
        totalTime: 0,
        startTime: Date.now(),
        isFinished: false,
        results: [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error loading exercises",
        loading: false,
      });
    }
  },

  validateAnswer: (answer: string): boolean => {
    const { currentExercise, startTime } = get();
    if (!currentExercise) return false;

    // Normalize answers for comparison (trim and normalize spaces)
    const normalizedAnswer = answer.trim().replace(/\s+/g, " ");
    const normalizedCorrect = currentExercise.respuesta_correcta
      .trim()
      .replace(/\s+/g, " ");
    const correct = normalizedAnswer === normalizedCorrect;
    const timeSeconds = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;

    const { user } = useSession.getState();
    const streak = user?.streak || 0;
    const points = correct
      ? calculatePoints(correct, timeSeconds, streak)
      : 0;

    const newResults = [
      ...get().results,
      {
        exerciseId: currentExercise.id,
        correct,
        time: timeSeconds,
        points,
        tipo: currentExercise.tipo,
      },
    ];

    set({
      results: newResults,
      score: get().score + points,
      correctCount: correct ? get().correctCount + 1 : get().correctCount,
      totalTime: get().totalTime + timeSeconds,
    });

    return correct;
  },

  nextQuestion: async () => {
    const { currentIndex, exercises } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex >= exercises.length) {
      // Wait for finishPractice to complete before setting isFinished
      await get().finishPractice();
      set({ isFinished: true });
      return;
    }

    set({
      currentIndex: nextIndex,
      currentExercise: exercises[nextIndex],
      startTime: Date.now(),
    });
  },

  finishPractice: async () => {
    const { results, score, correctCount, totalTime } = get();
    const { user } = useSession.getState();

    if (!user) {
      console.error("No user found when finishing practice");
      return;
    }

    if (results.length === 0) {
      console.warn("No results to save");
      return;
    }

    try {
      // Save all partidas
      const saveErrors: string[] = [];
      for (const result of results) {
        const { error } = await savePartida({
          usuario_id: user.id,
          ejercicio_id: result.exerciseId,
          correcto: result.correct,
          tiempo_respuesta: result.time,
          puntos: result.points,
          tipo: result.tipo,
        });
        
        if (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          saveErrors.push(`Error saving partida for exercise ${result.exerciseId}: ${errorMessage}`);
          console.error(`Error saving partida:`, error);
        }
      }

      if (saveErrors.length > 0) {
        console.error("Errors saving partidas:", saveErrors);
        set({ error: `Error guardando algunas partidas: ${saveErrors.join(", ")}` });
      }

      // Update user stats
      const newExp = user.exp + score;
      // Increment streak only if all answers were correct, otherwise reset to 0
      const newStreak =
        correctCount === results.length && results.length > 0
          ? user.streak + 1
          : 0;

      const { error: updateError } = await updateUserStats(user.id, newExp, newStreak);
      
      if (updateError) {
        const errorMessage = updateError instanceof Error ? updateError.message : String(updateError);
        console.error("Error updating user stats:", updateError);
        set({ error: `Error actualizando estadísticas: ${errorMessage}` });
      } else {
        console.log(`Successfully updated user stats: exp=${newExp}, streak=${newStreak}`);
      }

      // Refresh user in session store
      await useSession.getState().refreshUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error finishing practice:", error);
      set({ error: `Error finalizando práctica: ${errorMessage}` });
    }
  },

  reset: () => {
    set({
      exercises: [],
      currentIndex: 0,
      score: 0,
      correctCount: 0,
      totalTime: 0,
      startTime: null,
      isFinished: false,
      results: [],
      currentExercise: null,
      loading: false,
      error: null,
    });
  },

  startTimer: () => {
    set({ startTime: Date.now() });
  },

  getCurrentTime: (): number => {
    const { startTime } = get();
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  },
}));

