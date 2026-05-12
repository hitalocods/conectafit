import { Star } from 'lucide-react';
import type { Review } from '../types';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="premium-card p-6">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-fitGreen text-fitGreen" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{review.comment}</p>
      <div className="mt-5">
        <p className="font-extrabold">{review.userName}</p>
        <p className="text-xs font-semibold text-zinc-400">{new Date(review.date).toLocaleDateString('pt-BR')}</p>
      </div>
    </article>
  );
}
