import type { Filters } from '../types';
import { categories } from '../data/mockData';
import { supportedCities } from '../utils/locations';

export function FilterPanel({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  return (
    <aside className="glass-panel sticky top-24 rounded-[28px] p-5">
      <h2 className="text-lg font-extrabold">Filtros avancados</h2>
      <div className="mt-5 space-y-5">
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Cidade</span>
          <select
            value={filters.city}
            onChange={(event) => onChange({ ...filters, city: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
          >
            <option value="">Todas</option>
            {supportedCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Categoria</span>
          <select
            value={filters.category}
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Bairro</span>
          <input
            value={filters.neighborhood}
            onChange={(event) => onChange({ ...filters, neighborhood: event.target.value })}
            placeholder="Ex: Jockey"
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Preco maximo: R$ {filters.maxPrice}</span>
          <input
            type="range"
            min={0}
            max={1000}
            step={25}
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
            className="mt-3 w-full accent-violetGlow"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Avaliacao minima</span>
          <select
            value={filters.minRating}
            onChange={(event) => onChange({ ...filters, minRating: Number(event.target.value) })}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
          >
            <option value={0}>Qualquer nota</option>
            <option value={4.5}>4.5+</option>
            <option value={4.8}>4.8+</option>
            <option value={4.9}>4.9+</option>
          </select>
        </label>
        <label className="flex items-center justify-between rounded-2xl bg-white/70 p-4 text-sm font-bold dark:bg-white/10">
          Atendimento domiciliar
          <input type="checkbox" checked={filters.homeCare} onChange={(event) => onChange({ ...filters, homeCare: event.target.checked })} className="h-5 w-5 accent-fitGreen" />
        </label>
        <label className="flex items-center justify-between rounded-2xl bg-white/70 p-4 text-sm font-bold dark:bg-white/10">
          Atendimento online
          <input type="checkbox" checked={filters.onlineCare} onChange={(event) => onChange({ ...filters, onlineCare: event.target.checked })} className="h-5 w-5 accent-fitGreen" />
        </label>
      </div>
    </aside>
  );
}
