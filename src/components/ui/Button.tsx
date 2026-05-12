import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/format';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'bg-ink text-white shadow-premium hover:scale-[1.02] dark:bg-white dark:text-ink',
        variant === 'secondary' && 'border border-black/10 bg-white/80 text-ink hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white',
        variant === 'ghost' && 'text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
