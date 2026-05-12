import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Camera, Heart, MapPin, MessageCircle, Share2, Star, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReviewCard } from '../components/ReviewCard';
import { Button } from '../components/ui/Button';
import { getProfessionalByIdFromFirestore, listReviews } from '../services/professionalService';
import { formatCurrency, instagramHandle, instagramUrl, whatsappUrl } from '../utils/format';
import { fadeUp } from '../utils/animation';
import type { Professional } from '../types';
import { useToast } from '../hooks/useToast';

export default function ProfessionalProfile() {
  const { id } = useParams();
  const [professional, setProfessional] = useState<Professional | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProfessionalByIdFromFirestore(id)
      .then(setProfessional)
      .finally(() => setIsLoading(false));
  }, [id]);

  const reviews = listReviews(professional?.id);

  if (isLoading) {
    return <div className="section-shell min-h-[70vh] pt-8 text-lg font-extrabold">Carregando perfil...</div>;
  }

  if (!professional) {
    return (
      <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-extrabold">Profissional nao encontrado</h1>
        <Link to="/explorar" className="mt-6">
          <Button>Voltar para explorar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section-shell pb-28 pt-8">
      <Link to="/explorar" className="inline-flex items-center gap-2 text-sm font-extrabold text-zinc-500 hover:text-ink dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <motion.section {...fadeUp} className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="overflow-hidden rounded-[36px]">
          <img src={professional.avatarUrl} alt={professional.name} className="h-[520px] w-full object-cover" />
        </div>
        <div className="glass-panel rounded-[36px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-violetGlow">{professional.specialty}</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{professional.name}</h1>
            </div>
            <button aria-label="Compartilhar" className="grid h-12 w-12 place-items-center rounded-full bg-white/80 dark:bg-white/10">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">
              <Star className="h-4 w-4 fill-fitGreen text-fitGreen" />
              {professional.rating} ({professional.reviewCount} avaliacoes)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">
              <MapPin className="h-4 w-4 text-violetGlow" />
              {professional.neighborhood}, {professional.city}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-3xl bg-white/70 p-4 dark:bg-white/10">
              <UserPlus className="h-5 w-5 text-violetGlow" />
              <p className="mt-3 text-2xl font-extrabold">{professional.students}</p>
              <p className="text-xs font-bold text-zinc-500">alunos</p>
            </div>
            <div className="rounded-3xl bg-white/70 p-4 dark:bg-white/10">
              <Users className="h-5 w-5 text-violetGlow" />
              <p className="mt-3 text-2xl font-extrabold">{professional.followers}</p>
              <p className="text-xs font-bold text-zinc-500">seguidores</p>
            </div>
            <div className="rounded-3xl bg-white/70 p-4 dark:bg-white/10">
              <Heart className="h-5 w-5 text-violetGlow" />
              <p className="mt-3 text-2xl font-extrabold">{professional.likes}</p>
              <p className="text-xs font-bold text-zinc-500">curtidas</p>
            </div>
          </div>
          <p className="mt-6 leading-8 text-zinc-600 dark:text-zinc-300">{professional.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/10">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Valor inicial</p>
              <p className="mt-2 text-2xl font-extrabold">{formatCurrency(professional.startingPrice)}</p>
            </div>
            <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/10">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Agenda</p>
              <p className="mt-2 text-sm font-bold">{professional.schedule.join(' | ')}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setProfessional((current) => (current ? { ...current, followers: current.followers + 1 } : current));
                toast('Voce seguiu este perfil', 'Em breve isso ficara salvo na sua conta.');
              }}
            >
              <Users className="h-5 w-5" />
              Seguir
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setProfessional((current) => (current ? { ...current, likes: current.likes + 1 } : current));
                toast('Perfil curtido', 'Essa interacao sera usada no ranking futuramente.');
              }}
            >
              <Heart className="h-5 w-5" />
              Curtir
            </Button>
            {professional.whatsapp ? (
              <a href={whatsappUrl(professional.whatsapp, professional.name)} target="_blank" rel="noreferrer" className="flex-1">
                <Button className="w-full">
                  <MessageCircle className="h-5 w-5" />
                  Agendar pelo WhatsApp
                </Button>
              </a>
            ) : (
              <Button type="button" disabled className="flex-1">
                <MessageCircle className="h-5 w-5" />
                Contato indisponivel
              </Button>
            )}
            {professional.instagram && (
              <a
                href={instagramUrl(professional.instagram)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-extrabold dark:border-white/10 dark:bg-white/10"
              >
                <Camera className="h-5 w-5" />
                {instagramHandle(professional.instagram)}
              </a>
            )}
          </div>
        </div>
      </motion.section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {professional.gallery.map((image) => (
          <motion.img
            {...fadeUp}
            key={image}
            src={image}
            alt={`Galeria de ${professional.name}`}
            loading="lazy"
            className="aspect-[4/3] rounded-[30px] object-cover shadow-premium"
          />
        ))}
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <div className="premium-card p-6">
          <h2 className="text-xl font-extrabold">Horarios e modalidades</h2>
          <div className="mt-5 space-y-3">
            {professional.schedule.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-white/10">
                <Clock className="h-5 w-5 text-violetGlow" />
                <span className="text-sm font-bold">{item}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-2xl bg-fitGreen/15 p-4">
              <Calendar className="h-5 w-5 text-emerald-700 dark:text-fitGreen" />
              <span className="text-sm font-bold">Presencial {professional.onlineCare ? '+ online' : ''} {professional.homeCare ? '+ domiciliar' : ''}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-2xl font-extrabold">Avaliacoes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
