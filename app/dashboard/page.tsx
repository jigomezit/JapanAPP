"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useSession } from "@/store/useSession";
import { calculateLevel, formatPoints } from "@/lib/utils";
import { getWeeklyRanking } from "@/lib/supabase";
import type { RankingEntry } from "@/lib/types";
import { Flame, Trophy, Star, Play } from "lucide-react";
import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, initialized, initialize, refreshUser } = useSession();
  const [ranking, setRanking] = React.useState<RankingEntry[]>([]);
  const [rankingLoading, setRankingLoading] = React.useState(true);

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

  // Función para recargar datos
  const loadData = React.useCallback(async () => {
    const currentUser = useSession.getState().user;
    if (currentUser) {
      // Refrescar datos del usuario
      await refreshUser();
      // Recargar ranking
      setRankingLoading(true);
      const { data } = await getWeeklyRanking();
      setRanking(data || []);
      setRankingLoading(false);
    }
  }, [refreshUser]);

  // Recargar datos cuando se vuelve al dashboard
  React.useEffect(() => {
    if (initialized && pathname === "/dashboard") {
      loadData();
    }
  }, [pathname, initialized, loadData]);

  // Recargar datos cuando la ventana vuelve a estar visible
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && pathname === "/dashboard" && initialized) {
        loadData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, initialized, loadData]);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const level = calculateLevel(user.exp);
  const userRankIndex = ranking.findIndex((entry) => entry.usuario_id === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-pink/10 via-kawaii-lavender/10 to-kawaii-blue/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-kawaii-pink to-kawaii-rose bg-clip-text text-transparent">
              ¡Hola, {user.nombre || "Usuario"}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Bienvenido a tu práctica de japonés JLPT N5
            </p>
          </div>
          <ProfileButton />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nivel</CardTitle>
                <Star className="h-5 w-5 text-kawaii-pink" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold">{level}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPoints(user.exp)} EXP
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Racha</CardTitle>
                <Flame className="h-5 w-5 text-kawaii-rose" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold">{user.streak}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  días consecutivos
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Puntos</CardTitle>
                <Trophy className="h-5 w-5 text-kawaii-blue" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold">{formatPoints(user.exp)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  puntos totales
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Practice Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link href="/practicar">
            <AnimatedButton
              variant="kawaii"
              size="lg"
              className="text-xl px-12 py-6"
              glow
            >
              <Play className="mr-2 h-6 w-6" />
              Practicar Ahora
            </AnimatedButton>
          </Link>
        </motion.div>

        {/* Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-kawaii-rose" />
                Ranking Semanal
              </CardTitle>
              <CardDescription>
                Top 10 usuarios de esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rankingLoading ? (
                <p className="text-muted-foreground text-center py-8">
                  Cargando ranking...
                </p>
              ) : ranking.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay datos de ranking aún
                </p>
              ) : (
                <div className="space-y-2">
                  {ranking.map((entry, index) => (
                    <motion.div
                      key={entry.usuario_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        entry.usuario_id === user.id
                          ? "bg-kawaii-pink/10 border-kawaii-pink"
                          : "bg-muted/50 border-transparent hover:border-kawaii-lavender"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            index === 0
                              ? "kawaii"
                              : entry.usuario_id === user.id
                              ? "default"
                              : "outline"
                          }
                          className="w-8 h-8 flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-semibold">
                            {entry.nombre || "Usuario"}
                            {entry.usuario_id === user.id && " (Tú)"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {entry.total_correctas}/{entry.total_intentos} correctas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatPoints(entry.total_puntos)}</p>
                        <p className="text-xs text-muted-foreground">puntos</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

