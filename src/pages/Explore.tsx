import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LocateFixed } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { FilterPanel } from '../components/FilterPanel';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { listProfessionals, listProfessionalsFromFirestore } from '../services/professionalService';
import type { Filters, Professional } from '../types';
import { fadeUp } from '../utils/animation';
import { useToast } from '../hooks/useToast';

const initialFilters: Filters = {
  category: '',
  city: '',
  neighborhood: '',
  maxPrice: 1000,
  minRating: 0,
  homeCare: false,
  onlineCare: false,
};

export default function Explore() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    listProfessionalsFromFirestore(filters)
      .then((items) => {
        if (isMounted) setProfessionals(items);
      })
      .catch(() => {
        if (isMounted) setProfessionals(listProfessionals(filters));
        toast('Nao consegui ler o Firestore', 'Mostrei apenas os dados de exemplo. Confira as regras do banco.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [filters, toast]);

  function locate() {
    setIsLocating(true);
    navigator.geolocation?.getCurrentPosition(
      () => setIsLocating(false),
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 3500 },
    );
  }

  return (
    <div className="section-shell pb-28 pt-8">
      <motion.div {...fadeUp} className="mb-8">
        <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violetGlow">Explorar</p>
        <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Encontre o match ideal.</h1>
            <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
              Primeiro em Teresina e Timon: filtre por categoria, cidade, bairro, preco, avaliacao e atendimento.
            </p>
          </div>
          <Button variant="secondary" onClick={locate}>
            <LocateFixed className="h-5 w-5" />
            {isLocating ? 'Localizando...' : 'Profissionais proximos'}
          </Button>
        </div>
      </motion.div>

      <SearchBar compact />

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <FilterPanel filters={filters} onChange={setFilters} />
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="font-extrabold">{professionals.length} resultados</p>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-300">Ordenado por relevancia e distancia</p>
          </div>
          {(isLocating || isLoading) && (
            <div className="mb-5 grid gap-5 md:grid-cols-2">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          )}
          {!isLoading && professionals.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {professionals.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          ) : !isLoading ? (
            <EmptyState />
          ) : null}
        </div>
      </div>
    </div>
  );
}
