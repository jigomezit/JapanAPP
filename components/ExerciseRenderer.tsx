"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePractice } from "@/store/usePractice";
import { ResultToast } from "@/components/ResultToast";
import { ParticleEffect } from "@/components/ParticleEffect";
import { ShakeAnimation } from "@/components/ShakeAnimation";
import { KanjiLectura } from "@/components/exercises/KanjiLectura";
import { FraseHueco } from "@/components/exercises/FraseHueco";
import { ImagenVocab } from "@/components/exercises/ImagenVocab";
import { Estructura } from "@/components/exercises/Estructura";
import { Ordenar } from "@/components/exercises/Ordenar";
import { Particula } from "@/components/exercises/Particula";
import { FormaVerbal } from "@/components/exercises/FormaVerbal";
import { LecturaCorta } from "@/components/exercises/LecturaCorta";
import type { ExerciseType } from "@/lib/types";

interface ExerciseRendererProps {
  onComplete?: () => void;
}

export function ExerciseRenderer({ onComplete }: ExerciseRendererProps) {
  const {
    currentExercise,
    validateAnswer,
    nextQuestion,
    isFinished,
    startTimer,
  } = usePractice();

  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(
    null
  );
  const [showResult, setShowResult] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [showParticles, setShowParticles] = React.useState(false);
  const [shake, setShake] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    if (currentExercise) {
      startTimer();
      setSelectedAnswer(null);
      setShowResult(false);
      setDisabled(false);
      setShowParticles(false);
      setShake(false);
    }
  }, [currentExercise, startTimer]);

  React.useEffect(() => {
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  const handleAnswer = (answer: string) => {
    if (disabled || !currentExercise) return;

    setSelectedAnswer(answer);
    setDisabled(true);

    const correct = validateAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setShowParticles(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleContinue = async () => {
    setShowResult(false);
    setShowParticles(false);
    await nextQuestion();
  };

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando ejercicio...</p>
      </div>
    );
  }

  const renderExercise = () => {
    switch (currentExercise.tipo) {
      case "kanji_lectura":
        return (
          <KanjiLectura
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      case "frase_hueco":
        return (
          <FraseHueco
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      case "imagen_vocab":
        return (
          <ImagenVocab
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      case "estructura":
        return (
          <Estructura
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      case "ordenar":
        return (
          <Ordenar
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      case "particula":
        return (
          <Particula
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      case "forma_verbal":
        return (
          <FormaVerbal
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      case "lectura_corta":
        return (
          <LecturaCorta
            exercise={currentExercise}
            onAnswer={handleAnswer}
            disabled={disabled}
          />
        );
      default:
        return <div>Tipo de ejercicio no soportado</div>;
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ShakeAnimation shake={shake}>
            <div className="relative">
              {renderExercise()}
              {showParticles && (
                <ParticleEffect
                  show={showParticles}
                  onComplete={() => setShowParticles(false)}
                />
              )}
            </div>
          </ShakeAnimation>
        </motion.div>
      </AnimatePresence>

      <ResultToast
        show={showResult}
        correct={isCorrect}
        message={
          isCorrect
            ? "¡Correcto! 🎉"
            : `Incorrecto. La respuesta correcta es: ${currentExercise.respuesta_correcta}`
        }
        onContinue={handleContinue}
      />
    </div>
  );
}

