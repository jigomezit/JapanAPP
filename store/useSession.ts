"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";
import { getUserStats, updateUserStats } from "@/lib/supabase";

interface SessionState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (
    email: string,
    password: string,
    nombre: string
  ) => Promise<{ error: Error | null; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Variable para almacenar la suscripción del listener
let authListener: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null;

export const useSession = create<SessionState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    // Si ya está inicializado, no hacer nada
    if (get().initialized) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await getUserStats(session.user.id);
        if (!error && data) {
          set({
            user: {
              id: data.id,
              email: data.email,
              nombre: data.nombre,
              avatar_url: data.avatar_url,
              exp: data.exp || 0,
              streak: data.streak || 0,
              creado_en: data.creado_en,
            },
            loading: false,
            initialized: true,
          });
        } else {
          set({ loading: false, initialized: true });
        }
      } else {
        set({ loading: false, initialized: true });
      }
    } catch (error) {
      console.error("Error initializing session:", error);
      set({ loading: false, initialized: true });
    }

    // Configurar listener solo una vez
    if (!authListener) {
      authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data, error } = await getUserStats(session.user.id);
          if (!error && data) {
            set({
              user: {
                id: data.id,
                email: data.email,
                nombre: data.nombre,
                avatar_url: data.avatar_url,
                exp: data.exp || 0,
                streak: data.streak || 0,
                creado_en: data.creado_en,
              },
              loading: false,
            });
          }
        } else if (event === "SIGNED_OUT") {
          set({ user: null, loading: false });
        }
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      await get().refreshUser();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  register: async (email: string, password: string, nombre: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Verificar si hay sesión activa inmediatamente después del registro
      // Si Supabase requiere confirmación de email, no habrá sesión
      if (data.session && data.user) {
        // Hay sesión activa, proceder con refreshUser
        await get().refreshUser();
        return { error: null, requiresEmailConfirmation: false };
      } else {
        // No hay sesión activa, probablemente requiere confirmación de email
        return { error: null, requiresEmailConfirmation: true };
      }
    } catch (error) {
      return { error: error as Error };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
      }
      // Actualizar el estado inmediatamente después del logout
      set({ user: null, loading: false });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así, limpiar el estado local
      set({ user: null, loading: false });
      throw error;
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      const { error } = await (supabase
        .from("usuarios") as any)
        .update(updates)
        .eq("id", user.id);

      if (!error) {
        set({ user: { ...user, ...updates } });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  refreshUser: async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const { data, error } = await getUserStats(authUser.id);
      if (!error && data) {
        set({
          user: {
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            avatar_url: data.avatar_url,
            exp: data.exp || 0,
            streak: data.streak || 0,
            creado_en: data.creado_en,
          },
        });
      }
    }
  },
}));

