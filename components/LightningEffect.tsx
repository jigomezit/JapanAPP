"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LightningEffectProps {
  show?: boolean;
  onComplete?: () => void;
}

export function LightningEffect({
  show = false,
  onComplete,
}: LightningEffectProps) {
  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  // SVG path for lightning bolt
  const lightningPath = "M 50 0 L 35 40 L 45 40 L 30 100 L 50 60 L 40 60 L 55 20 Z";

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Multiple lightning bolts for dramatic effect */}
            {[0, 1, 2].map((i) => (
              <motion.g
                key={i}
                initial={{ y: "-10%", opacity: 0 }}
                animate={{
                  y: ["-10%", "110%"],
                  opacity: [0, 1, 1, 0],
                  x: ["50%", `${50 + (i - 1) * 5}%`, "50%"],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                style={{
                  filter: "drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px #FFA500)",
                }}
              >
                <path
                  d={lightningPath}
                  fill="#FFD700"
                  transform={`translate(${50 + (i - 1) * 5}, 0) scale(0.5)`}
                />
              </motion.g>
            ))}
          </motion.svg>
          
          {/* Flash overlay */}
          <motion.div
            className="absolute inset-0 bg-yellow-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

