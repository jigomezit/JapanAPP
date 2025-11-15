"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/ExerciseCard";
import { GripVertical } from "lucide-react";
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
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null) return;

    const newOrder = [...orderedWords];
    const draggedItem = newOrder[draggedIndex];

    // Remover el elemento arrastrado
    newOrder.splice(draggedIndex, 1);
    // Insertar en la nueva posición
    newOrder.splice(dropIndex, 0, draggedItem);

    setOrderedWords(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
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
            Arrastra las palabras para ordenarlas correctamente
          </p>

          <div className="space-y-2 relative" style={{ isolation: "isolate" }}>
            {orderedWords.map((word, index) => {
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;
              
              return (
                <motion.div
                  key={word}
                  layout
                  initial={false}
                  animate={{
                    opacity: isDragging ? 0.7 : 1,
                    scale: isDragging ? 1.05 : isDragOver ? 1.03 : 1,
                    y: isDragging ? -5 : 0,
                    rotateZ: isDragging ? 2 : 0,
                    boxShadow: isDragging 
                      ? "0 10px 25px -5px rgba(255, 182, 193, 0.4), 0 8px 10px -6px rgba(255, 182, 193, 0.3)" 
                      : isDragOver 
                      ? "0 4px 12px -2px rgba(255, 182, 193, 0.3)" 
                      : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{
                    layout: { 
                      duration: 0.4, 
                      ease: [0.4, 0, 0.2, 1],
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    },
                    opacity: { duration: 0.2 },
                    scale: { 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    },
                    y: { 
                      duration: 0.2,
                      ease: "easeOut"
                    },
                    rotateZ: { 
                      duration: 0.2,
                      ease: "easeOut"
                    },
                    boxShadow: { 
                      duration: 0.3,
                      ease: "easeOut"
                    },
                  }}
                  whileHover={!disabled && !isDragging ? {
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 }
                  } : {}}
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`
                    flex items-center gap-3 cursor-move
                    px-4 py-3 bg-secondary rounded-xl border-2
                    ${isDragging ? "border-kawaii-pink" : ""}
                    ${isDragOver ? "border-kawaii-pink bg-kawaii-pink/10" : "border-transparent"}
                    ${disabled ? "cursor-not-allowed opacity-60" : ""}
                  `}
                  style={{
                    position: "relative",
                    zIndex: isDragging ? 1000 : isDragOver ? 10 : index + 1,
                  }}
              >
                  <GripVertical 
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isDragging 
                        ? "text-kawaii-pink" 
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="flex-1 text-lg font-medium">{word}</span>
                </motion.div>
              );
            })}
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

