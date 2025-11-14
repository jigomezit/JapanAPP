"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExerciseRenderer } from "@/components/ExerciseRenderer";
import { ProgressBar } from "@/components/ProgressBar";
import { usePractice } from "@/store/usePractice";
import { useSession } from "@/store/useSession";
import { formatTime, formatPoints, calculateAccuracy } from "@/lib/utils";
import type { ExerciseType } from "@/lib/types";
import { Clock, Trophy, Target } from "lucide-react";

export default function PracticePage() {
  const router = useRouter();
  const { user, initialized, initialize } = useSession();
  const {
    exercises,
    currentIndex,
    score,
    correctCount,
    totalTime,
    loading,
    loadExercises,
    isFinished,
    reset,
  } = usePractice();

  const [exerciseTypes, setExerciseTypes] = React.useState<ExerciseType[]>([
    "kanji_lectura",
    "frase_hueco",
    "imagen_vocab",
    "estructura",
    "ordenar",
    "particula",
    "forma_verbal",
    "lectura_corta",
  ]);

  React.useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  React.useEffect(() => {
    if (initialized && !user) {
      router.push("/auth/login");
    }
  }, [initialized, user, router]);

  React.useEffect(() => {
    if (user && exercises.length === 0 && !loading && !isFinished) {
      loadExercises(exerciseTypes, 10);
    }
  }, [user, exercises.length, loading, isFinished, loadExercises, exerciseTypes]);

  React.useEffect(() => {
    if (isFinished) {
      router.push("/resultado");
    }
  }, [isFinished, router]);

  const handleComplete = () => {
    router.push("/resultado");
  };

  const progress = exercises.length > 0 ? ((currentIndex + 1) / exercises.length) * 100 : 0;
  const accuracy = calculateAccuracy(correctCount, currentIndex + 1);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando ejercicios...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-pink/10 via-kawaii-lavender/10 to-kawaii-blue/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progreso</p>
                <p className="text-2xl font-bold">
                  {currentIndex + 1}/{exercises.length}
                </p>
              </div>
              <Target className="h-8 w-8 text-kawaii-pink" />
            </div>
          </Card>

          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Puntos</p>
                <p className="text-2xl font-bold">{formatPoints(score)}</p>
              </div>
              <Trophy className="h-8 w-8 text-kawaii-rose" />
            </div>
          </Card>

          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Precisión</p>
                <p className="text-2xl font-bold">{accuracy}%</p>
              </div>
              <Badge variant="kawaii">{correctCount}</Badge>
            </div>
          </Card>

          <Card className="border-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo</p>
                <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-kawaii-blue" />
            </div>
          </Card>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProgressBar value={progress} max={100} showLabel />
        </motion.div>

        {/* Exercise Renderer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ExerciseRenderer onComplete={handleComplete} />
        </motion.div>
      </div>
    </div>
  );
}

