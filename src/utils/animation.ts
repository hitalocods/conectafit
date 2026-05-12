import { cubicBezier, type MotionProps } from 'framer-motion';

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: cubicBezier(0.22, 1, 0.36, 1) },
} satisfies MotionProps;

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};
