"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/ExerciseCard";
import type { Exercise } from "@/lib/types";

interface ImagenVocabProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function ImagenVocab({
  exercise,
  onAnswer,
  disabled = false,
}: ImagenVocabProps) {
  const { contenido, opciones } = exercise;
  const imagenUrl = contenido.imagen_url as string;

  return (
    <ExerciseCard title={exercise.pregunta}>
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          {imagenUrl ? (
            <div className="relative w-64 h-64 rounded-xl overflow-hidden border-2 border-kawaii-lavender shadow-md">
              <Image
                src={imagenUrl}
                alt="Vocabulary image"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-64 h-64 rounded-xl bg-muted flex items-center justify-center border-2 border-kawaii-lavender">
              <p className="text-muted-foreground">Imagen no disponible</p>
            </div>
          )}
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
                className="w-full h-16 text-lg hover:bg-kawaii-lavender/10 hover:border-kawaii-lavender transition-all"
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

