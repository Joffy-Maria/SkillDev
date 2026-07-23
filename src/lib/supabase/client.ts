import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzavarvyvlzxcdqfaivh.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXZhcnZ5dmx6eGNkcWZhaXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjkwNTksImV4cCI6MjEwMDQwNTA1OX0.dLiKImswBSvvxjcYW2gHb7Hf2RDfY5WM-jRE009aAxA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
