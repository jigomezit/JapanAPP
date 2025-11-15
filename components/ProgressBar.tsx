"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  isStreakActive?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  isStreakActive = false,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progreso</span>
          <span>
            <AnimatedNumber value={percentage} decimals={0} suffix="%" />
          </span>
        </div>
      )}
      <Progress 
        value={percentage} 
        className="h-3 w-full"
        isStreakActive={isStreakActive}
      />
    </div>
  );
}

