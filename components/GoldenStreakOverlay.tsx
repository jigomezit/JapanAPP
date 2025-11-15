"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoldenStreakOverlayProps {
  show?: boolean;
  onContinue?: () => void;
}

export function GoldenStreakOverlay({
  show = false,
  onContinue,
}: GoldenStreakOverlayProps) {
  const particles = Array.from({ length: 30 }, (_, i) => i);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Golden particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((i) => {
              const angle = (i * 360) / particles.length;
              const radius = 150 + Math.random() * 100;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const delay = Math.random() * 0.5;
              const duration = 1.5 + Math.random() * 0.5;

              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 1, 0],
                    x: [0, x],
                    y: [0, y],
                  }}
                  transition={{
                    duration,
                    delay,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: "easeOut",
                  }}
                >
                  {i % 3 === 0 ? (
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ) : i % 3 === 1 ? (
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  ) : (
                    <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Content card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-yellow-400 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <Zap className="w-16 h-16 text-yellow-500 fill-yellow-500 mx-auto" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2"
            >
              ¡5 Respuestas Correctas Consecutivas!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-amber-800 mb-6"
            >
              ¡Increíble! Estás en racha 🔥
            </motion.p>

            {onContinue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={onContinue}
                  variant="kawaii"
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg"
                >
                  Continuar
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

