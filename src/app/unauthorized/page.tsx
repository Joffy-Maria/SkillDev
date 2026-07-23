'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-center bg-[#09090B] font-sans">
      <FloatingParticles />

      <Card variant="gold" className="relative z-10 max-w-md p-8 space-y-6 shadow-[0_0_50px_rgba(201,162,39,0.15)]">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-extrabold">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white font-mono">403</h1>
          <h2 className="text-lg font-bold text-rose-400 mt-1">Unauthorized Access</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            You do not have administrative privileges to access this section of SkillDev.
          </p>
        </div>

        <Link href="/dashboard">
          <Button variant="gold" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Student Portal
          </Button>
        </Link>
      </Card>
    </div>
  );
}
