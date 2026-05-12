import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../utils/animation';

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violetGlow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">{children}</p>}
    </motion.div>
  );
}
