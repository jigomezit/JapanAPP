"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, CheckCircle2 } from "lucide-react";

interface SuccessCelebrationProps {
  show?: boolean;
  onComplete?: () => void;
  message?: string;
}

export function SuccessCelebration({
  show = false,
  onComplete,
  message = "¡Cuenta creada exitosamente!",
}: SuccessCelebrationProps) {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  const confetti = Array.from({ length: 30 }, (_, i) => i);

  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden">
            {confetti.map((i) => {
              const angle = (i * 360) / confetti.length;
              const radius = 200 + Math.random() * 150;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const delay = Math.random() * 0.3;
              const duration = 1.5 + Math.random() * 0.5;
              const colors = [
                "text-kawaii-pink",
                "text-kawaii-rose",
                "text-kawaii-blue",
                "text-kawaii-lavender",
                "text-yellow-400",
              ];
              const color = colors[Math.floor(Math.random() * colors.length)];

              return (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute top-1/2 left-1/2"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 0.8, 0],
                    x: [0, x],
                    y: [0, y],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration,
                    delay,
                    ease: "easeOut",
                  }}
                >
                  <Star className={`w-3 h-3 ${color} fill-current`} />
                </motion.div>
              );
            })}
          </div>

          {/* Sparkle particles around center */}
          <div className="absolute inset-0 flex items-center justify-center">
            {particles.map((i) => {
              const angle = (i * 360) / particles.length;
              const radius = 60 + Math.random() * 40;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const delay = i * 0.05;
              const size = 4 + Math.random() * 4;

              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 1, 0],
                    x: [0, x],
                    y: [0, y],
                  }}
                  transition={{
                    duration: 1,
                    delay,
                    ease: "easeOut",
                  }}
                >
                  <Sparkles
                    className="w-4 h-4 text-kawaii-pink"
                    style={{ width: size, height: size }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Success message card */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.2,
            }}
            className="relative bg-gradient-to-br from-kawaii-pink/95 via-kawaii-rose/95 to-kawaii-lavender/95 backdrop-blur-md border-4 border-kawaii-pink rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center pointer-events-auto"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-kawaii-pink/20 to-kawaii-rose/20 blur-xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.4,
              }}
              className="relative mb-4"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.8,
                }}
              >
                <CheckCircle2 className="w-20 h-20 text-white mx-auto drop-shadow-lg" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-yellow-300 fill-yellow-300" />
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
            >
              {message}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-sm"
            >
              ¡Bienvenido a la comunidad!
            </motion.p>

            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-4 border-white/30"
              animate={{
                borderColor: [
                  "rgba(255,255,255,0.3)",
                  "rgba(255,255,255,0.6)",
                  "rgba(255,255,255,0.3)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

