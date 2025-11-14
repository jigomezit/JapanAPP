"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  glow?: boolean;
  pulse?: boolean;
}

export function AnimatedButton({
  className,
  glow = false,
  pulse = false,
  children,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={cn(
          glow && "hover:shadow-lg hover:shadow-kawaii-pink/50 transition-shadow",
          pulse && "animate-pulse",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

