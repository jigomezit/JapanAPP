"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/ExerciseCard";
import type { Exercise } from "@/lib/types";

interface LecturaCortaProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function LecturaCorta({
  exercise,
  onAnswer,
  disabled = false,
}: LecturaCortaProps) {
  const { contenido, opciones, pregunta } = exercise;
  const texto = contenido.texto as string;

  return (
    <ExerciseCard>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-muted/50 rounded-xl p-6 border-2 border-kawaii-lavender">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {texto}
            </p>
          </div>

          <div className="bg-primary/10 rounded-xl p-4 border-2 border-primary/20">
            <p className="font-semibold text-lg">{pregunta}</p>
          </div>
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
                className="w-full h-16 text-lg hover:bg-kawaii-lavender/10 hover:border-kawaii-lavender transition-all text-left justify-start px-4"
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

