-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ejercicios table
CREATE TABLE IF NOT EXISTS ejercicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL,
  pregunta TEXT NOT NULL,
  contenido JSONB NOT NULL,
  opciones TEXT[] NOT NULL,
  respuesta_correcta TEXT NOT NULL,
  nivel TEXT NOT NULL,
  explicacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT,
  avatar_url TEXT,
  exp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partidas table
CREATE TABLE IF NOT EXISTS partidas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  ejercicio_id UUID NOT NULL REFERENCES ejercicios(id) ON DELETE CASCADE,
  correcto BOOLEAN NOT NULL,
  tiempo_respuesta INTEGER NOT NULL,
  puntos INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ejercicios_tipo ON ejercicios(tipo);
CREATE INDEX IF NOT EXISTS idx_ejercicios_nivel ON ejercicios(nivel);
CREATE INDEX IF NOT EXISTS idx_partidas_usuario_id ON partidas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_partidas_fecha ON partidas(fecha);
CREATE INDEX IF NOT EXISTS idx_partidas_tipo ON partidas(tipo);

-- Enable Row Level Security
ALTER TABLE ejercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ejercicios (public read)
CREATE POLICY "Ejercicios are viewable by everyone" ON ejercicios
  FOR SELECT USING (true);

-- RLS Policies for usuarios
CREATE POLICY "Users can view their own profile" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for partidas
CREATE POLICY "Users can view their own partidas" ON partidas
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert their own partidas" ON partidas
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

