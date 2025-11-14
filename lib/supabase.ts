import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper functions
export async function getExercises(
  types?: string[],
  limit: number = 10
): Promise<{ data: any[]; error: Error | null }> {
  let query = supabase.from("ejercicios").select("*");

  if (types && types.length > 0) {
    query = query.in("tipo", types);
  }

  query = query.eq("nivel", "N5").order("id", { ascending: false }).limit(limit);

  // For random order, we'll shuffle in the client after fetching
  const { data, error } = await query;

  if (error) {
    return { data: [], error };
  }

  // Shuffle the results
  const shuffled = data ? [...data].sort(() => Math.random() - 0.5) : [];

  return { data: shuffled, error: null };
}

export async function savePartida(partida: {
  usuario_id: string;
  ejercicio_id: string;
  correcto: boolean;
  tiempo_respuesta: number;
  puntos: number;
  tipo: string;
}): Promise<{ error: Error | null }> {
  const { error } = await supabase.from("partidas").insert({
    ...partida,
    fecha: new Date().toISOString(),
  });

  return { error };
}

export async function getWeeklyRanking(): Promise<{
  data: any[];
  error: Error | null;
}> {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const { data: partidas, error: partidasError } = await supabase
    .from("partidas")
    .select("usuario_id, puntos, correcto")
    .gte("fecha", startOfWeek.toISOString());

  if (partidasError) {
    return { data: [], error: partidasError };
  }

  if (!partidas || partidas.length === 0) {
    return { data: [], error: null };
  }

  // Aggregate by user
  const rankingMap = new Map<string, {
    usuario_id: string;
    total_puntos: number;
    total_correctas: number;
    total_intentos: number;
  }>();

  partidas.forEach((entry) => {
    const userId = entry.usuario_id;
    if (!rankingMap.has(userId)) {
      rankingMap.set(userId, {
        usuario_id: userId,
        total_puntos: 0,
        total_correctas: 0,
        total_intentos: 0,
      });
    }
    const userData = rankingMap.get(userId)!;
    userData.total_puntos += entry.puntos || 0;
    userData.total_intentos += 1;
    if (entry.correcto) {
      userData.total_correctas += 1;
    }
  });

  // Get user details for ranking entries
  const userIds = Array.from(rankingMap.keys());
  const { data: usuarios, error: usuariosError } = await supabase
    .from("usuarios")
    .select("id, nombre, avatar_url")
    .in("id", userIds);

  if (usuariosError) {
    return { data: [], error: usuariosError };
  }

  // Combine ranking data with user details
  const ranking = Array.from(rankingMap.values())
    .map((entry) => {
      const usuario = usuarios?.find((u) => u.id === entry.usuario_id);
      return {
        ...entry,
        nombre: usuario?.nombre || "Usuario",
        avatar_url: usuario?.avatar_url || null,
      };
    })
    .sort((a, b) => b.total_puntos - a.total_puntos)
    .slice(0, 10);

  return { data: ranking, error: null };
}

export async function updateUserStats(
  userId: string,
  exp: number,
  streak: number
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("usuarios")
    .update({ exp, streak })
    .eq("id", userId);

  return { error };
}

export async function getUserStats(
  userId: string
): Promise<{ data: any | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
}

