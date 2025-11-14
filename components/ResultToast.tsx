"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultToastProps {
  show: boolean;
  correct: boolean;
  message?: string;
  onClose?: () => void;
}

export function ResultToast({
  show,
  correct,
  message,
  onClose,
}: ResultToastProps) {
  React.useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed top-20 left-1/2 transform -translate-x-1/2 z-50",
            "flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg",
            correct
              ? "bg-green-50 border-2 border-green-200 text-green-900"
              : "bg-red-50 border-2 border-red-200 text-red-900"
          )}
        >
          {correct ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <span className="font-semibold">
            {message || (correct ? "¡Correcto!" : "Incorrecto")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

