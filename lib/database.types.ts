export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      ejercicios: {
        Row: {
          id: string;
          tipo: string;
          pregunta: string;
          contenido: Json;
          opciones: string[];
          respuesta_correcta: string;
          nivel: string;
          explicacion: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tipo: string;
          pregunta: string;
          contenido: Json;
          opciones: string[];
          respuesta_correcta: string;
          nivel: string;
          explicacion?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tipo?: string;
          pregunta?: string;
          contenido?: Json;
          opciones?: string[];
          respuesta_correcta?: string;
          nivel?: string;
          explicacion?: string | null;
          created_at?: string;
        };
      };
      usuarios: {
        Row: {
          id: string;
          email: string;
          nombre: string | null;
          avatar_url: string | null;
          exp: number;
          streak: number;
          creado_en: string;
        };
        Insert: {
          id: string;
          email: string;
          nombre?: string | null;
          avatar_url?: string | null;
          exp?: number;
          streak?: number;
          creado_en?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nombre?: string | null;
          avatar_url?: string | null;
          exp?: number;
          streak?: number;
          creado_en?: string;
        };
      };
      partidas: {
        Row: {
          id: string;
          usuario_id: string;
          ejercicio_id: string;
          correcto: boolean;
          tiempo_respuesta: number;
          puntos: number;
          tipo: string;
          fecha: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          ejercicio_id: string;
          correcto: boolean;
          tiempo_respuesta: number;
          puntos: number;
          tipo: string;
          fecha?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          ejercicio_id?: string;
          correcto?: boolean;
          tiempo_respuesta?: number;
          puntos?: number;
          tipo?: string;
          fecha?: string;
        };
      };
    };
  };
}

