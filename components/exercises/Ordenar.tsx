"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { shuffleArray } from "@/lib/utils";

interface OrdenarProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function Ordenar({
  exercise,
  onAnswer,
  disabled = false,
}: OrdenarProps) {
  const { contenido } = exercise;
  const palabras = (contenido.palabras as string[]) || [];

  const [orderedWords, setOrderedWords] = React.useState<string[]>(() =>
    shuffleArray([...palabras])
  );

  const moveWord = (index: number, direction: "up" | "down") => {
    if (disabled) return;

    const newOrder = [...orderedWords];
    if (direction === "up" && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [
        newOrder[index],
        newOrder[index - 1],
      ];
    } else if (direction === "down" && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
    }
    setOrderedWords(newOrder);
  };

  const handleSubmit = () => {
    if (disabled) return;
    const answer = orderedWords.join(" ");
    onAnswer(answer);
  };

  return (
    <ExerciseCard title={exercise.pregunta}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-muted-foreground mb-4">
            Ordena las palabras para formar una frase correcta
          </p>

          <div className="space-y-2">
            <AnimatePresence>
              {orderedWords.map((word, index) => (
                <motion.div
                  key={`${word}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveWord(index, "up")}
                      disabled={disabled || index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveWord(index, "down")}
                      disabled={disabled || index === orderedWords.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 px-4 py-3 bg-secondary rounded-xl border-2 border-transparent hover:border-kawaii-pink transition-all">
                    {word}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            variant="kawaii"
            size="lg"
            className="w-full mt-6"
            onClick={handleSubmit}
            disabled={disabled}
          >
            Confirmar orden
          </Button>
        </motion.div>
      </div>
    </ExerciseCard>
  );
}

