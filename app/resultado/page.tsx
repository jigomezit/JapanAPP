"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/AnimatedButton";
import { usePractice } from "@/store/usePractice";
import { useSession } from "@/store/useSession";
import { formatTime, formatPoints, calculateAccuracy } from "@/lib/utils";
import { CheckCircle2, XCircle, Trophy, Target, Clock, Home } from "lucide-react";
import Link from "next/link";

export default function ResultadoPage() {
  const router = useRouter();
  const { user, initialized, initialize } = useSession();
  const {
    results,
    score,
    correctCount,
    totalTime,
    exercises,
    reset,
    isFinished,
  } = usePractice();

  React.useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  React.useEffect(() => {
    if (initialized && !user) {
      router.push("/auth/login");
    }
  }, [initialized, user, router]);

  React.useEffect(() => {
    if (initialized && user && !isFinished && results.length === 0) {
      router.push("/dashboard");
    }
  }, [initialized, user, isFinished, results.length, router]);

  React.useEffect(() => {
    return () => {
      // Reset practice state when leaving the page
      reset();
    };
  }, [reset]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando resultados...</p>
      </div>
    );
  }

  if (!user || results.length === 0) {
    return null;
  }

  const accuracy = calculateAccuracy(correctCount, results.length);
  const totalQuestions = results.length;

  // Get exercise details for each result
  const resultDetails = results.map((result) => {
    const exercise = exercises.find((e) => e.id === result.exerciseId);
    return {
      ...result,
      exercise,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-pink/10 via-kawaii-lavender/10 to-kawaii-blue/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-kawaii-pink to-kawaii-rose bg-clip-text text-transparent mb-2">
            ¡Ronda Completada! 🎉
          </h1>
          <p className="text-muted-foreground">
            Revisa tus resultados y sigue practicando
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 text-center">
              <CardHeader className="pb-2">
                <Trophy className="h-8 w-8 mx-auto text-kawaii-rose" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatPoints(score)}</p>
                <p className="text-sm text-muted-foreground">Puntos</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 text-center">
              <CardHeader className="pb-2">
                <Target className="h-8 w-8 mx-auto text-kawaii-pink" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Precisión</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 text-center">
              <CardHeader className="pb-2">
                <CheckCircle2 className="h-8 w-8 mx-auto text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {correctCount}/{totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground">Correctas</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 text-center">
              <CardHeader className="pb-2">
                <Clock className="h-8 w-8 mx-auto text-kawaii-blue" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatTime(totalTime)}</p>
                <p className="text-sm text-muted-foreground">Tiempo</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Results Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Desglose de Resultados</CardTitle>
              <CardDescription>
                Revisa cada ejercicio y aprende de tus errores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultDetails.map((result, index) => (
                  <motion.div
                    key={result.exerciseId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      result.correct
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {result.correct ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-semibold">
                            Ejercicio {index + 1}
                          </span>
                          <Badge variant={result.correct ? "default" : "destructive"}>
                            {result.tipo}
                          </Badge>
                        </div>
                        {result.exercise && (
                          <p className="text-sm text-muted-foreground mb-1">
                            {result.exercise.pregunta}
                          </p>
                        )}
                        {result.exercise?.explicacion && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {result.exercise.explicacion}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-lg">+{result.points}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(result.time)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Link href="/dashboard">
            <AnimatedButton variant="outline" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Volver al Dashboard
            </AnimatedButton>
          </Link>
          <Link href="/practicar">
            <AnimatedButton variant="kawaii" size="lg" glow>
              <Target className="mr-2 h-5 w-5" />
              Practicar de Nuevo
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

