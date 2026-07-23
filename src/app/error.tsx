'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 text-center">
      <Card variant="gold" className="max-w-md p-8 space-y-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-white">System Exception Encountered</h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-mono">
            {error.message || 'An unexpected error occurred in SkillDev app runtime.'}
          </p>
        </div>

        <Button variant="gold" onClick={() => reset()} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" /> Reload Application State
        </Button>
      </Card>
    </div>
  );
}
