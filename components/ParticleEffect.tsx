"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface ParticleEffectProps {
  show?: boolean;
  onComplete?: () => void;
}

export function ParticleEffect({
  show = false,
  onComplete,
}: ParticleEffectProps) {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((i) => {
        const angle = (i * 360) / particles.length;
        const radius = 80;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, x],
              y: [0, y],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              ease: "easeOut",
            }}
          >
            <Star className="w-4 h-4 text-kawaii-pink fill-kawaii-pink" />
          </motion.div>
        );
      })}
    </div>
  );
}

