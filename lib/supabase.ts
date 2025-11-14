import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Variables de entorno de Supabase faltantes.\n\n" +
    "Por favor, crea un archivo .env.local en la raíz del proyecto con:\n\n" +
    "NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase\n" +
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase\n\n" +
    "Puedes encontrar estas credenciales en tu proyecto de Supabase:\n" +
    "Dashboard > Settings > API"
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
  const { error } = await (supabase
    .from("partidas") as any)
    .insert({
      usuario_id: partida.usuario_id,
      ejercicio_id: partida.ejercicio_id,
      correcto: partida.correcto,
      tiempo_respuesta: partida.tiempo_respuesta,
      puntos: partida.puntos,
      tipo: partida.tipo,
      fecha: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving partida:", error);
    return { error: new Error(error.message || "Error guardando partida") };
  }

  return { error: null };
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
    .gte("fecha", startOfWeek.toISOString()) as any;

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

  (partidas as any[]).forEach((entry: any) => {
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
    .in("id", userIds) as any;

  if (usuariosError) {
    return { data: [], error: usuariosError };
  }

  // Combine ranking data with user details
  const ranking = Array.from(rankingMap.values())
    .map((entry) => {
      const usuario = (usuarios as any[])?.find((u: any) => u.id === entry.usuario_id);
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
    // @ts-ignore - Supabase types are not properly inferred
    .update({ exp, streak })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user stats:", error);
    return { error: new Error(error.message || "Error actualizando estadísticas del usuario") };
  }

  return { error: null };
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

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ data: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Subir archivo a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { data: null, error: new Error(uploadError.message) };
    }

    // Obtener URL pública del archivo
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Actualizar avatar_url en la base de datos
    const { error: updateError } = await supabase
      .from("usuarios")
      // @ts-ignore - Supabase types are not properly inferred
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      return { data: null, error: new Error(updateError.message) };
    }

    return { data: publicUrl, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateUserProfile(
  userId: string,
  updates: { nombre?: string; avatar_url?: string }
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from("usuarios")
      // @ts-ignore - Supabase types are not properly inferred
      .update(updates)
      .eq("id", userId);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

