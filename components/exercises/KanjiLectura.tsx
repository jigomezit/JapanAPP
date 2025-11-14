"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/ExerciseCard";
import type { Exercise } from "@/lib/types";

interface KanjiLecturaProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function KanjiLectura({
  exercise,
  onAnswer,
  disabled = false,
}: KanjiLecturaProps) {
  const { contenido, opciones } = exercise;
  const kanji = contenido.kanji as string;

  return (
    <ExerciseCard title={exercise.pregunta}>
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="text-6xl font-bold mb-4">{kanji}</div>
          <p className="text-muted-foreground">
            ¿Cuál es la lectura correcta de este kanji?
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {opciones.map((opcion, index) => (
            <motion.div
              key={opcion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full h-16 text-lg hover:bg-kawaii-pink/10 hover:border-kawaii-pink transition-all"
                onClick={() => onAnswer(opcion)}
                disabled={disabled}
              >
                {opcion}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </ExerciseCard>
  );
}

