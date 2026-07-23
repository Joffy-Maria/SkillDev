'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, Code2, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const loggedUser = await signIn(usernameOrEmail, password);
      if (loggedUser) {
        if (loggedUser.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg('Invalid username/email or password credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090B] flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Split Screen - SkillDev Branding & Aesthetics */}
      <div className="relative lg:w-1/2 bg-gradient-to-br from-[#09090B] via-[#111113] to-[#1a170d] p-8 md:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
        <FloatingParticles />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#D4AF37] flex items-center justify-center font-black text-black text-2xl shadow-[0_0_30px_rgba(201,162,39,0.4)]">
              S
            </div>
            <span className="text-2xl font-black text-white font-mono tracking-wider flex items-center gap-2">
              SkillDev <Sparkles className="w-5 h-5 text-[#C9A227]" />
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight pt-8">
            Empowering Next-Gen <span className="gold-gradient-text">Coding Clubs</span> &amp; Placement Leaders.
          </h2>

          <p className="text-sm md:text-base text-zinc-400 max-w-lg leading-relaxed pt-2">
            Elevate your DSA mastery, compete on animated podium leaderboards, solve daily tasks with Monaco Editor, and crack campus tech interviews.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12">
          <div className="p-4 rounded-2xl bg-[#151518]/80 border border-white/10 backdrop-blur-md space-y-1">
            <Code2 className="w-5 h-5 text-[#C9A227]" />
            <h4 className="text-xs font-bold text-white">Monaco Editor</h4>
            <p className="text-[11px] text-zinc-400">Live Judge0 execution</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#151518]/80 border border-white/10 backdrop-blur-md space-y-1">
            <Trophy className="w-5 h-5 text-[#C9A227]" />
            <h4 className="text-xs font-bold text-white">Gamified XP</h4>
            <p className="text-[11px] text-zinc-400">Level &amp; streak tracking</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#151518]/80 border border-white/10 backdrop-blur-md space-y-1">
            <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
            <h4 className="text-xs font-bold text-white">Role Security</h4>
            <p className="text-[11px] text-zinc-400">Student &amp; Admin portals</p>
          </div>
        </div>

        <p className="relative z-10 text-xs text-zinc-500 pt-8 font-mono">
          &copy; 2026 SkillDev Platform. All rights reserved.
        </p>
      </div>

      {/* Right Split Screen - Clean Authentication Form */}
      <div className="lg:w-1/2 p-8 md:p-16 flex items-center justify-center bg-[#09090B]">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Enter your credentials to enter your portal workspace.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">Email Address or Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#151518] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#151518] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#151518] border-white/10 text-[#C9A227] focus:ring-0"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-[#C9A227] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" isLoading={loading}>
              Login to SkillDev <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="text-center text-xs text-zinc-400 pt-4 border-t border-white/10">
            Student account needed?{' '}
            <Link href="/signup" className="text-[#C9A227] hover:underline font-bold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
