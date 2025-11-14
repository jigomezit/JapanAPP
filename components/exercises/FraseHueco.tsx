"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/ExerciseCard";
import type { Exercise } from "@/lib/types";

interface FraseHuecoProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function FraseHueco({
  exercise,
  onAnswer,
  disabled = false,
}: FraseHuecoProps) {
  const { contenido, opciones } = exercise;
  const frase = contenido.frase as string;

  // Replace placeholder with blank
  const fraseConHueco = frase.replace("___", "_____");

  return (
    <ExerciseCard title={exercise.pregunta}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-xl mb-6 leading-relaxed">
            {fraseConHueco.split("_____").map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < fraseConHueco.split("_____").length - 1 && (
                  <span className="inline-block w-24 h-8 border-b-2 border-kawaii-pink mx-2" />
                )}
              </React.Fragment>
            ))}
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
                className="w-full h-16 text-lg hover:bg-kawaii-blue/10 hover:border-kawaii-blue transition-all"
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

