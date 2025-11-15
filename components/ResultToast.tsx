"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ResultToastProps {
  show: boolean;
  correct: boolean;
  message?: string;
  onContinue?: () => void;
}

export function ResultToast({
  show,
  correct,
  message,
  onContinue,
}: ResultToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
              "flex flex-col items-center justify-center gap-4 px-6 py-4 rounded-t-2xl shadow-2xl",
              "w-full max-w-2xl mx-auto text-center pointer-events-auto",
              correct
                ? "bg-green-50 border-2 border-green-200 text-green-900"
                : "bg-red-50 border-2 border-red-200 text-red-900"
            )}
          >
            <div className="flex items-center gap-3">
              {correct ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <span className="font-semibold text-lg">
                {message || (correct ? "¡Correcto!" : "Incorrecto")}
              </span>
            </div>
            {onContinue && (
              <Button
                onClick={onContinue}
                variant={correct ? "default" : "destructive"}
                size="lg"
                className="min-w-[120px]"
              >
                Continuar
              </Button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

