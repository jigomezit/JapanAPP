"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function ExerciseCard({
  children,
  className,
  title,
}: ExerciseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className={cn("max-w-2xl mx-auto", className)}>
        {title && (
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

