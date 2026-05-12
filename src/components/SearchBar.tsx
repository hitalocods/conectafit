import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/Button';

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    navigate(`/explorar${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass-panel grid gap-3 rounded-[28px] p-3 sm:grid-cols-[1fr_auto_auto] ${compact ? '' : 'mx-auto max-w-4xl'}`}
    >
      <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-white/80 px-4 dark:bg-white/10">
        <Search className="h-5 w-5 text-zinc-400" />
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Busque personal, nutricionista, studio..."
          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-zinc-400"
        />
      </label>
      <div className="hidden min-h-14 items-center gap-3 rounded-2xl bg-white/80 px-4 dark:bg-white/10 sm:flex">
        <MapPin className="h-5 w-5 text-violetGlow" />
        <span className="text-sm font-bold">Teresina e Timon</span>
      </div>
      <Button type="submit" className="min-h-14">
        <SlidersHorizontal className="h-5 w-5" />
        Encontrar
      </Button>
    </form>
  );
}
