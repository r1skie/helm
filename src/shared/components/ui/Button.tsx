'use client';
import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

import { tHover } from '@/shared/lib/motion';

type Variant = 'primary' | 'outlined' | 'ghost' | 'danger' | 'icon';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-content text-base hover:bg-content/90 active:bg-content/80 ring-1 ring-content/20 shadow-sm',
  outlined: 'bg-transparent text-content ring-1 ring-border hover:bg-item',
  ghost: 'bg-transparent text-altwhite hover:bg-item hover:text-content',
  danger: 'bg-transparent text-danger ring-1 ring-danger/60 hover:bg-danger/15',
  icon: 'bg-transparent text-altwhite hover:bg-item hover:text-content',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-6 text-sm',
};

interface Props extends Omit<HTMLMotionProps<'button'>, 'className'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...rest
}: Props) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium '
    + 'transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 '
    + 'focus-visible:ring-content/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base '
    + 'disabled:opacity-50 disabled:pointer-events-none';
  const sz = variant === 'icon' ? 'h-9 w-9' : SIZES[size];
  return (
    <motion.button
      whileHover={disabled || loading ? undefined : tHover.whileHover}
      whileTap={disabled || loading ? undefined : tHover.whileTap}
      disabled={disabled || loading}
      className={`${base} ${VARIANTS[variant]} ${sz} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </motion.button>
  );
}
