-- Migration: Add remaining dev policies for missing tables
-- Description: Add dev policies for friend_relationships and behaviour_observations
-- TODO: Remove these policies when implementing proper authentication

-- Friend Relationships  
CREATE POLICY IF NOT EXISTS "DEV: Public read friend_relationships"
  ON friend_relationships FOR SELECT
  TO anon, authenticated
  USING (true);

-- Behaviour Observations
CREATE POLICY IF NOT EXISTS "DEV: Public read behaviour_observations"
  ON behaviour_observations FOR SELECT
  TO anon, authenticated
  USING (true);

-- NOTE: These policies allow unauthenticated access!
-- Remove when implementing proper authentication

