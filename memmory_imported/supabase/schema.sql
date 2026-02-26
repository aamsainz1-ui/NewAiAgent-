-- PAPACLAW Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- 1. Memory (long-term curated memories)
CREATE TABLE IF NOT EXISTS memory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  category text NOT NULL, -- preference, decision, fact, session_log
  area text, -- config, tools, models, dashboard, business, team, football, operations, model-routing
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Daily Logs
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  path text,
  active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 4. Team Members
CREATE TABLE IF NOT EXISTS team (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  nickname text,
  team_lead text,
  salary numeric,
  role text,
  responsibilities text[],
  created_at timestamptz DEFAULT now()
);

-- 5. Business Config
CREATE TABLE IF NOT EXISTS business (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Models
CREATE TABLE IF NOT EXISTS models (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id text NOT NULL UNIQUE,
  name text,
  alias text,
  provider text,
  is_primary boolean DEFAULT false,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 7. Agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id text NOT NULL UNIQUE,
  name text,
  role text,
  model text,
  workspace text,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 8. Templates
CREATE TABLE IF NOT EXISTS templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  type text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. Dashboard Nodes
CREATE TABLE IF NOT EXISTS dashboard_nodes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id text NOT NULL UNIQUE,
  label text,
  type text,
  category text,
  weight numeric DEFAULT 1,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 10. Dashboard Edges
CREATE TABLE IF NOT EXISTS dashboard_edges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL,
  target text NOT NULL,
  edge_type text,
  weight numeric DEFAULT 1,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(source, target)
);

-- Enable RLS but allow service_role full access
ALTER TABLE memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE business ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_edges ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon read access (service_role bypasses RLS)
CREATE POLICY "Allow read access" ON memory FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON daily_logs FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON team FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON business FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON models FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON agents FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON templates FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON dashboard_nodes FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON dashboard_edges FOR SELECT USING (true);
