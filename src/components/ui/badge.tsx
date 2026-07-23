import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'gold' | 'daily' | 'weekly' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variantStyles = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    gold: 'bg-[#C9A227]/15 text-[#C9A227] border-[#C9A227]/40 shadow-[0_0_10px_rgba(201,162,39,0.2)]',
    daily: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    weekly: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    default: 'bg-white/5 text-zinc-300 border-white/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md uppercase tracking-wider',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
