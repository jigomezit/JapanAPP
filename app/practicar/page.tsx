"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExerciseRenderer } from "@/components/ExerciseRenderer";
import { ProgressBar } from "@/components/ProgressBar";
import { LightningEffect } from "@/components/LightningEffect";
import { GoldenStreakOverlay } from "@/components/GoldenStreakOverlay";
import { AnimatedNumber } from "@/components/AnimatedNumber";
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
    consecutiveCorrect,
    resetConsecutiveCorrect,
    getCurrentTime,
  } = usePractice();

  const [showLightning, setShowLightning] = React.useState(false);
  const [showGoldenOverlay, setShowGoldenOverlay] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);

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

  // Show lightning and golden overlay when reaching 5 consecutive correct answers
  React.useEffect(() => {
    if (consecutiveCorrect === 5) {
      setShowLightning(true);
      setShowGoldenOverlay(true);
    }
  }, [consecutiveCorrect]);

  // Update current time every second
  React.useEffect(() => {
    if (isFinished || loading) {
      setCurrentTime(0);
      return;
    }

    const interval = setInterval(() => {
      const exerciseTime = getCurrentTime();
      setCurrentTime(exerciseTime);
    }, 1000);

    // Initial update
    const exerciseTime = getCurrentTime();
    setCurrentTime(exerciseTime);

    return () => clearInterval(interval);
  }, [getCurrentTime, isFinished, loading, currentIndex]);

  const handleLightningComplete = () => {
    setShowLightning(false);
  };

  const handleGoldenOverlayContinue = () => {
    setShowGoldenOverlay(false);
    resetConsecutiveCorrect();
  };

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
          className="grid grid-cols-2 gap-4"
        >
          <Card className="border-2 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between flex-1">
              <div>
                <p className="text-sm text-muted-foreground">Progreso</p>
                <p className="text-2xl font-bold">
                  <AnimatedNumber value={currentIndex + 1} />
                  /{exercises.length}
                </p>
              </div>
              <Target className="h-8 w-8 text-kawaii-pink" />
            </div>
          </Card>

          <Card className="border-2 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between flex-1">
              <div>
                <p className="text-sm text-muted-foreground">Puntos</p>
                <p className="text-2xl font-bold">
                  <AnimatedNumber value={score} formatLocale="es-ES" />
                </p>
              </div>
              <Trophy className="h-8 w-8 text-kawaii-rose" />
            </div>
          </Card>

          <Card className="border-2 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between flex-1">
              <div>
                <p className="text-sm text-muted-foreground">Precisión</p>
                <p className="text-2xl font-bold">
                  <AnimatedNumber value={accuracy} suffix="%" />
                </p>
              </div>
              <Badge variant="kawaii">
                <AnimatedNumber value={correctCount} />
              </Badge>
            </div>
          </Card>

          <Card className="border-2 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between flex-1">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo</p>
                <p className="text-2xl font-bold">{formatTime(totalTime + currentTime)}</p>
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
          <ProgressBar 
            value={progress} 
            max={100} 
            showLabel 
            isStreakActive={consecutiveCorrect >= 5}
          />
        </motion.div>

        {/* Exercise Renderer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ExerciseRenderer onComplete={handleComplete} />
        </motion.div>

        {/* Lightning Effect */}
        <LightningEffect show={showLightning} onComplete={handleLightningComplete} />

        {/* Golden Streak Overlay */}
        <GoldenStreakOverlay show={showGoldenOverlay} onContinue={handleGoldenOverlayContinue} />
      </div>
    </div>
  );
}

