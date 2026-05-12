import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BadgeCheck, MapPin, Star } from 'lucide-react';
import type { Professional } from '../types';
import { formatCurrency } from '../utils/format';
import { getPlanStatus } from '../utils/subscription';

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const planStatus = getPlanStatus(professional);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="premium-card group overflow-hidden"
    >
      <Link to={`/profissional/${professional.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={professional.avatarUrl}
            alt={professional.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          {(professional.featured || planStatus !== 'expired') && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-ink backdrop-blur-xl">
              <BadgeCheck className="h-4 w-4 text-violetGlow" />
              {planStatus === 'trial' ? 'Pro gratis' : planStatus === 'active' ? 'Pro' : 'Destaque'}
            </span>
          )}
          <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xl">
            {professional.distanceKm.toFixed(1)} km de voce
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">{professional.name}</h3>
              <p className="mt-1 text-sm font-semibold text-zinc-500 dark:text-zinc-300">{professional.specialty}</p>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white dark:bg-white dark:text-ink">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-300">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {professional.neighborhood}
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-ink dark:text-white">
              <Star className="h-4 w-4 fill-fitGreen text-fitGreen" />
              {professional.rating} ({professional.reviewCount})
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <p className="text-sm text-zinc-500 dark:text-zinc-300">
              A partir de <span className="block text-lg font-extrabold text-ink dark:text-white">{formatCurrency(professional.startingPrice)}</span>
            </p>
            <p className="rounded-full bg-fitGreen/15 px-3 py-1.5 text-xs font-extrabold text-emerald-700 dark:text-fitGreen">
              Agendar
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
