# JLPT N5 Practice App

Aplicación web completa para practicar japonés nivel JLPT N5 con ejercicios interactivos, sistema de puntuación, ranking y microinteracciones estilo Duolingo.

## 🎯 Características

- **8 tipos de ejercicios interactivos:**
  - Kanji → lectura (1.2)
  - Completar frase con palabra (1.4)
  - Imagen → palabra correcta (1.5)
  - Completar frase gramatical (2.1)
  - Ordenar palabras (2.2)
  - Elegir partícula correcta (2.3)
  - Elegir forma verbal correcta (2.4)
  - Comprensión lectura corta (3.2)

- **Sistema de puntuación:**
  - 10 puntos base por respuesta correcta
  - Bonus por velocidad
  - Bonus por racha (streak)
  - Sistema de niveles basado en experiencia

- **Ranking semanal:**
  - Top 10 usuarios de la semana
  - Actualización en tiempo real

- **Microinteracciones:**
  - Animaciones suaves (fade-in, zoom, shake)
  - Efectos de partículas en respuestas correctas
  - Feedback visual inmediato
  - Barra de progreso animada

- **Estética kawaii minimal:**
  - Colores pastel (rosa, azul, lavanda)
  - Bordes redondeados
  - Sombras suaves
  - Tipografía Inter

## 🛠️ Stack Tecnológico

- **Frontend:**
  - Next.js 14 (App Router)
  - React 19
  - TypeScript
  - TailwindCSS
  - Shadcn/UI
  - Framer Motion
  - Zustand
  - Lucide Icons

- **Backend:**
  - Supabase (PostgreSQL, Auth, Storage, Realtime)

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase
- Git

## 🚀 Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd JLPTN5
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.local.example .env.local
```

Editar `.env.local` y agregar tus credenciales de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Configurar la base de datos:**
   - Crear un proyecto en Supabase
   - Ejecutar el script SQL en `supabase/migrations/001_initial_schema.sql` en el SQL Editor de Supabase
   - Esto creará las tablas: `ejercicios`, `usuarios`, `partidas`

5. **Ejecutar el proyecto:**
```bash
npm run dev
```

6. **Abrir en el navegador:**
```
http://localhost:3000
```

## 📊 Estructura de Base de Datos

### Tabla `ejercicios`
- `id` (uuid): ID único del ejercicio
- `tipo` (text): Tipo de ejercicio
- `pregunta` (text): Pregunta del ejercicio
- `contenido` (jsonb): Contenido del ejercicio (kanji, frase, imagen_url, palabras, texto)
- `opciones` (text[]): Opciones de respuesta
- `respuesta_correcta` (text): Respuesta correcta
- `nivel` (text): Nivel del ejercicio (N5)
- `explicacion` (text): Explicación opcional

### Tabla `usuarios`
- `id` (uuid): ID único del usuario (referencia a auth.users)
- `email` (text): Email del usuario
- `nombre` (text): Nombre del usuario
- `avatar_url` (text): URL del avatar
- `exp` (int): Experiencia total (puntos)
- `streak` (int): Racha de días consecutivos
- `creado_en` (timestamp): Fecha de creación

### Tabla `partidas`
- `id` (uuid): ID único de la partida
- `usuario_id` (uuid): ID del usuario
- `ejercicio_id` (uuid): ID del ejercicio
- `correcto` (boolean): Si la respuesta fue correcta
- `tiempo_respuesta` (int): Tiempo en segundos
- `puntos` (int): Puntos obtenidos
- `tipo` (text): Tipo de ejercicio
- `fecha` (timestamp): Fecha de la partida

## 📝 Agregar Ejercicios

Para agregar ejercicios, inserta datos en la tabla `ejercicios` de Supabase. Ejemplo:

```sql
INSERT INTO ejercicios (tipo, pregunta, contenido, opciones, respuesta_correcta, nivel, explicacion)
VALUES (
  'kanji_lectura',
  '¿Cuál es la lectura de este kanji?',
  '{"kanji": "日"}',
  ARRAY['にち', 'ひ', 'に', 'か'],
  'にち',
  'N5',
  'El kanji 日 se lee "にち" en la palabra 日本 (Japón)'
);
```

## 🎨 Personalización

### Colores
Los colores kawaii están definidos en `tailwind.config.ts`:
- `kawaii-pink`: #FFB6C1
- `kawaii-blue`: #87CEEB
- `kawaii-lavender`: #E6E6FA
- `kawaii-rose`: #FFC0CB
- `kawaii-sky`: #B0E0E6
- `kawaii-mint`: #F0FFF0

### Animaciones
Las animaciones están definidas en `tailwind.config.ts`:
- `fade-in`: Entrada suave
- `zoom-in`: Zoom pequeño
- `shake`: Sacudida
- `glow`: Resplandor

## 📚 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Si tienes problemas o preguntas, abre un issue en el repositorio.

