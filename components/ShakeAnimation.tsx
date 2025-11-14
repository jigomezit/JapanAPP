"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShakeAnimationProps {
  children: React.ReactNode;
  className?: string;
  shake?: boolean;
}

export function ShakeAnimation({
  children,
  className,
  shake = false,
}: ShakeAnimationProps) {
  return (
    <motion.div
      className={cn(className)}
      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

