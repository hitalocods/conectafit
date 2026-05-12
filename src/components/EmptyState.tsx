import { SearchX } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="premium-card flex min-h-80 flex-col items-center justify-center p-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-300">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold">Nenhum resultado encontrado</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-300">
        Ajuste os filtros ou tente uma categoria mais ampla para encontrar profissionais proximos.
      </p>
    </div>
  );
}
