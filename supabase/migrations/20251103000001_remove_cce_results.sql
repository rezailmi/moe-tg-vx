-- Remove CCE results table and related policies/triggers

-- Policies (if any)
DROP POLICY IF EXISTS "Teachers can view CCE results" ON cce_results;
DROP POLICY IF EXISTS "Form teachers can manage CCE results" ON cce_results;
DROP POLICY IF EXISTS "DEV: Public read cce_results" ON cce_results;

-- Trigger
DROP TRIGGER IF EXISTS cce_results_updated_at ON cce_results;

-- Table
DROP TABLE IF EXISTS cce_results CASCADE;


