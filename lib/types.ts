export type ExerciseType =
  | "kanji_lectura"
  | "frase_hueco"
  | "imagen_vocab"
  | "estructura"
  | "ordenar"
  | "particula"
  | "forma_verbal"
  | "lectura_corta";

export interface ExerciseContent {
  kanji?: string;
  frase?: string;
  imagen_url?: string;
  palabras?: string[];
  texto?: string;
  [key: string]: unknown;
}

export interface Exercise {
  id: string;
  tipo: ExerciseType;
  pregunta: string;
  contenido: ExerciseContent;
  opciones: string[];
  respuesta_correcta: string;
  nivel: string;
  explicacion?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string | null;
  avatar_url: string | null;
  exp: number;
  streak: number;
  creado_en: string;
}

export interface Partida {
  id: string;
  usuario_id: string;
  ejercicio_id: string;
  correcto: boolean;
  tiempo_respuesta: number;
  puntos: number;
  tipo: ExerciseType;
  fecha: string;
}

export interface PracticeSession {
  exercises: Exercise[];
  currentIndex: number;
  score: number;
  correctCount: number;
  totalTime: number;
  startTime: number;
  results: Array<{
    exerciseId: string;
    correct: boolean;
    time: number;
    points: number;
  }>;
}

export interface RankingEntry {
  usuario_id: string;
  nombre: string;
  avatar_url: string | null;
  total_puntos: number;
  total_correctas: number;
  total_intentos: number;
}

