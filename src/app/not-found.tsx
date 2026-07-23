'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 text-center">
      <FloatingParticles />

      <Card variant="gold" className="relative z-10 max-w-md p-8 space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center font-extrabold text-2xl">
          <Compass className="w-8 h-8 animate-spin" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold font-mono text-white">404</h1>
          <h2 className="text-lg font-bold text-[#C9A227] mt-1">Page Not Found</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            The coding route or challenge you requested does not exist or has been relocated.
          </p>
        </div>

        <Link href="/dashboard">
          <Button variant="gold" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
}
