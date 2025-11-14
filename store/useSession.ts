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
  ) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useSession = create<SessionState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: async () => {
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

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
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
          });
        }
      } else if (event === "SIGNED_OUT") {
        set({ user: null });
      }
    });
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
      const { error } = await supabase.auth.signUp({
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

      await get().refreshUser();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
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

