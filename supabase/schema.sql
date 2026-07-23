-- SkillDev Production Supabase PostgreSQL Schema
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  uid TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  college TEXT,
  year TEXT,
  avatar_url TEXT,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  tasks_completed_count INT NOT NULL DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'dsa',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  type TEXT NOT NULL DEFAULT 'daily',
  xp_reward INT NOT NULL DEFAULT 20,
  starter_code JSONB,
  test_cases JSONB,
  deadline TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Progress Table
CREATE TABLE IF NOT EXISTS public.progress (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(uid) ON DELETE CASCADE,
  task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'completed',
  submitted_code TEXT,
  xp_earned INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Topics Table
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'dsa',
  description TEXT,
  resource_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Study Materials Table
CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'link',
  url TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'leetcode',
  description TEXT,
  created_by TEXT DEFAULT 'Admin',
  upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Performers Table
CREATE TABLE IF NOT EXISTS public.performers (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES public.users(uid) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_avatar TEXT,
  week_label TEXT NOT NULL,
  achievement_reason TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Users Update Self" ON public.users;
DROP POLICY IF EXISTS "Public Read Tasks" ON public.tasks;
DROP POLICY IF EXISTS "Public Read Progress" ON public.progress;
DROP POLICY IF EXISTS "Student Insert Progress" ON public.progress;
DROP POLICY IF EXISTS "Public Read Topics" ON public.topics;
DROP POLICY IF EXISTS "Public Read Materials" ON public.materials;
DROP POLICY IF EXISTS "Public Read Performers" ON public.performers;

-- Public & Student Policies
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users Update Self" ON public.users FOR UPDATE USING (auth.uid()::text = uid);

CREATE POLICY "Public Read Tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public Read Progress" ON public.progress FOR SELECT USING (true);
CREATE POLICY "Student Insert Progress" ON public.progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public Read Materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Public Read Performers" ON public.performers FOR SELECT USING (true);
