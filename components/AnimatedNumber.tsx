"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  formatLocale?: string;
}

export function AnimatedNumber({
  value,
  duration = 0.3,
  decimals = 0,
  className = "",
  prefix = "",
  suffix = "",
  formatLocale,
}: AnimatedNumberProps) {
  const formatNumber = (num: number): string => {
    const formatted = num.toFixed(decimals);
    if (formatLocale) {
      return parseFloat(formatted).toLocaleString(formatLocale);
    }
    return formatted;
  };

  const displayValue = formatNumber(value);

  return (
    <span className={className}>
      {prefix}
      <AnimatePresence mode="wait">
        <motion.span
          key={displayValue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className="inline-block"
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
      {suffix}
    </span>
  );
}

