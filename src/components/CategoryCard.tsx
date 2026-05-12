import { motion } from 'framer-motion';
import type { Category } from '../types';

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="premium-card group relative overflow-hidden p-5"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${category.accent}`} />
      <div className="flex items-center gap-4">
        <div className={`grid h-13 w-13 place-items-center rounded-3xl bg-gradient-to-br ${category.accent} text-ink shadow-glow`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-extrabold">{category.name}</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">{category.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
