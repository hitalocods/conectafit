import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, BarChart3, CalendarCheck, MapPin, ShieldCheck, Star, Zap } from 'lucide-react';
import { categories, professionals, reviews } from '../data/mockData';
import { CategoryCard } from '../components/CategoryCard';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { ReviewCard } from '../components/ReviewCard';
import { SearchBar } from '../components/SearchBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { fadeUp } from '../utils/animation';

export default function Home() {
  const featured = professionals.filter((professional) => professional.featured);

  return (
    <div className="pb-28">
      <section className="section-shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="pt-8">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-zinc-700 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-zinc-200">
            <Zap className="h-4 w-4 text-fitGreen" />
            Marketplace premium de Teresina e Timon
          </motion.div>
          <motion.h1 {...fadeUp} className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-ink dark:text-white sm:text-6xl lg:text-7xl">
            Encontre saude, estetica e fitness com experiencia de produto premium.
          </motion.h1>
          <motion.p {...fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            ConectaFit aproxima clientes de profissionais, studios e lojas com busca inteligente, reviews reais e contato direto pelo WhatsApp.
          </motion.p>
          <motion.div {...fadeUp} className="mt-8">
            <SearchBar />
          </motion.div>
          <motion.div {...fadeUp} className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
            {[
              ['4.9', 'media de avaliacao'],
              ['12k+', 'leads mensais'],
              ['24h', 'agenda conectada'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-black/5 bg-white/65 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                <p className="text-2xl font-extrabold">{value}</p>
                <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-300">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div {...fadeUp} className="relative">
          <div className="glass-panel relative overflow-hidden rounded-[36px] p-4">
            <img
              src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1200&q=80"
              alt="Profissional fitness acompanhando cliente"
              className="aspect-[4/5] w-full rounded-[28px] object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/30 bg-white/75 p-5 shadow-premium backdrop-blur-2xl dark:bg-ink/75">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-500 dark:text-zinc-300">Disponivel hoje</p>
                  <p className="mt-1 text-xl font-extrabold">A partir de 18:30</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fitGreen text-ink">
                  <CalendarCheck className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 text-violetGlow" />
                Jockey, 1.8 km
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-shell py-14">
        <SectionHeading eyebrow="Categorias" title="Tudo para sua rotina de bem-estar">
          Profissionais liberais, clinicas, academias, studios e lojas em uma experiencia unica.
        </SectionHeading>
        <motion.div {...fadeUp} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
      </section>

      <section className="section-shell py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Destaques" title="Profissionais em destaque" />
          <Link to="/explorar" className="inline-flex items-center gap-2 font-extrabold text-violetGlow">
            Ver todos <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <motion.div {...fadeUp} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </motion.div>
      </section>

      <section className="section-shell py-14">
        <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
          <motion.div {...fadeUp} className="glass-panel rounded-[36px] p-8 sm:p-10">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-ink text-fitGreen dark:bg-white dark:text-ink">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Transforme sua agenda em uma maquina de leads.</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-300">
              Perfil profissional, galeria, avaliacoes, metricas e contato direto pelo WhatsApp para captar clientes com menos friccao.
            </p>
            <Link to="/dashboard" className="mt-8 inline-flex">
              <Button>
                Cadastrar como profissional <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-3">
            {[
              [BadgeCheck, 'Perfil verificado', 'Construa autoridade com dados, fotos e reviews.'],
              [ShieldCheck, 'Reviews confiaveis', 'Experiencias registradas por clientes reais.'],
              [Star, 'Destaque pago', 'Planos preparados para monetizacao do marketplace.'],
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="premium-card p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violetGlow/15 text-violetGlow">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-extrabold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-300">{String(text)}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-shell py-14">
        <SectionHeading eyebrow="Avaliacoes" title="Experiencias que vendem antes do primeiro contato" />
        <motion.div {...fadeUp} className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
