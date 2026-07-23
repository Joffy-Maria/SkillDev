'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Code2, Shield } from 'lucide-react';
import Link from 'next/link';

export default function RootHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center py-16 px-4 space-y-8">
      <FloatingParticles />

      <div className="relative z-10 max-w-3xl space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-[#C9A227]/15 text-[#C9A227] text-xs font-bold uppercase tracking-widest border border-[#C9A227]/40 shadow-[0_0_20px_rgba(201,162,39,0.2)] inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Next-Gen Placement Preparation Platform
        </span>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Master Coding &amp; Placement Prep with <span className="gold-gradient-text">SkillDev</span>
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The luxury dark platform for coding clubs. Solve daily challenges, run real-time code via Monaco &amp; Judge0, climb the interactive leaderboard podium, and conquer top tech interviews.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/login">
            <Button variant="gold" size="lg" className="shadow-[0_0_30px_rgba(201,162,39,0.3)]">
              Sign In to Portal <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
