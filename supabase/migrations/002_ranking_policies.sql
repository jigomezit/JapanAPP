-- Migration: Add RLS policies for weekly ranking
-- This allows authenticated users to view:
-- 1. Partidas from the current week (for ranking calculation)
-- 2. Public user information (id, nombre, avatar_url) for ranking display

-- Policy to allow reading partidas from current week for ranking
-- This allows any authenticated user to read partidas from the current week
-- The week starts on Sunday (same as JavaScript Date.getDay())
-- We calculate the start of week: CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE) days
CREATE POLICY "Users can view weekly partidas for ranking" ON partidas
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL 
    AND fecha >= CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::text || ' days')::interval
  );

-- Policy to allow reading public user information for ranking
-- This allows any authenticated user to read public profile info (id, nombre, avatar_url)
-- Note: The existing policy "Users can view their own profile" already allows reading own profile
-- This policy extends it to allow reading other users' public info for ranking
CREATE POLICY "Users can view public user info for ranking" ON usuarios
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

