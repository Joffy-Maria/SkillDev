'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'glass';
  hoverGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverGlow = true,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverGlow ? { y: -3 } : undefined}
      className={cn(
        'relative rounded-2xl p-6 transition-all duration-300',
        variant === 'default' && 'bg-[#151518] border border-white/5 shadow-xl hover:border-white/10',
        variant === 'glass' && 'glass-card',
        variant === 'gold' && 'bg-gradient-to-br from-[#151518] to-[#1a170d] border border-[#C9A227]/30 shadow-[0_4px_25px_rgba(201,162,39,0.1)]',
        hoverGlow && 'hover:border-[#C9A227]/40 hover:shadow-[0_8px_30px_rgba(201,162,39,0.12)]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
