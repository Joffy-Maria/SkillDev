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

-- Disable Row Level Security (RLS) to ensure full read/write REST API access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers DISABLE ROW LEVEL SECURITY;
