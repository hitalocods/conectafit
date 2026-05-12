import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Camera, Copy, Eye, Heart, ImagePlus, Lock, MessageSquareReply, MousePointerClick, QrCode, Save, Star, TrendingUp, Upload, UserPlus, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { professionals, reviews } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getSavedProfessionalProfile, saveProfessionalProfile } from '../services/professionalService';
import { fadeUp } from '../utils/animation';
import { normalizeInstagram } from '../utils/format';
import { normalizeCityLabel, supportedCities } from '../utils/locations';
import { createTrialDates, formatPixMessage, getPlanStatus, getTrialDaysLeft, pixPayment } from '../utils/subscription';
import type { LucideIcon } from 'lucide-react';
import type { Professional } from '../types';

const profile = professionals[0];
const maxInlinePhotoSize = 250 * 1024;
const legacyMockTrialStart = '2026-05-01T12:00:00.000Z';

function cleanPhone(value: string) {
  return value.replace(/\D/g, '');
}

export default function ProfessionalDashboard() {
  const { toast } = useToast();
  const { firebaseUser, appUser, isLoading } = useAuth();
  const [dashboardProfile, setDashboardProfile] = useState<Professional>(profile);
  const [photoPreview, setPhotoPreview] = useState(profile.avatarUrl);
  const [isEditing, setIsEditing] = useState(true);
  const [hasPublishedProfile, setHasPublishedProfile] = useState(false);
  const currentPlanStatus = getPlanStatus(dashboardProfile);
  const trialDaysLeft = getTrialDaysLeft(dashboardProfile.trialEndsAt);
  const isExpired = currentPlanStatus === 'expired';

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    getSavedProfessionalProfile(firebaseUser.uid).then((existingProfile) => {
      if (existingProfile) {
        const normalizedProfile =
          existingProfile.trialStartedAt === legacyMockTrialStart
            ? { ...existingProfile, ...createTrialDates(), planStatus: 'trial' as const }
            : existingProfile;
        setDashboardProfile(normalizedProfile);
        setPhotoPreview(normalizedProfile.avatarUrl);
        setHasPublishedProfile(true);
        setIsEditing(false);
      } else {
        setHasPublishedProfile(false);
        setIsEditing(true);
      }
    });
  }, [firebaseUser?.uid]);

  function handlePhotoFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Arquivo invalido', 'Escolha uma imagem em PNG, JPG ou WEBP.');
      return;
    }
    if (file.size > maxInlinePhotoSize) {
      toast('Imagem muito grande', 'Use uma imagem menor que 250 KB ou cole uma URL da foto.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setPhotoPreview(result);
      setDashboardProfile((current) => ({ ...current, avatarUrl: result }));
    };
    reader.readAsDataURL(file);
  }

  const stats: Array<[LucideIcon, string | number, string]> = useMemo(
    () => [
      [MousePointerClick, dashboardProfile.clicks, 'cliques no perfil'],
      [Users, dashboardProfile.leads, 'leads recebidos'],
      [Star, dashboardProfile.rating, 'nota media'],
      [Eye, '38%', 'crescimento mensal'],
    ],
    [dashboardProfile],
  );

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const specialty = String(form.get('specialty') || '').trim();
    const category = String(form.get('category') || '').trim();
    const city = normalizeCityLabel(String(form.get('city') || 'Teresina'));
    const neighborhood = String(form.get('neighborhood') || '').trim();
    const whatsapp = cleanPhone(String(form.get('whatsapp') || ''));
    const startingPrice = Number(form.get('startingPrice') || 0);
    const description = String(form.get('description') || '').trim();
    const missingFields = [
      !name && 'nome',
      !specialty && 'especialidade',
      !category && 'categoria',
      !neighborhood && 'bairro',
      !whatsapp && 'WhatsApp',
      !startingPrice && 'valor inicial',
      !description && 'descricao',
    ].filter(Boolean);

    if (missingFields.length) {
      toast('Complete o perfil', `Preencha: ${missingFields.join(', ')}.`);
      return;
    }

    const trialDates =
      hasPublishedProfile && dashboardProfile.trialStartedAt && dashboardProfile.trialStartedAt !== legacyMockTrialStart
        ? {
            trialStartedAt: dashboardProfile.trialStartedAt,
            trialEndsAt: dashboardProfile.trialEndsAt,
          }
        : createTrialDates();

    const savedProfile: Professional = {
      ...dashboardProfile,
      ...trialDates,
      id: firebaseUser?.uid || profile.id,
      name,
      specialty,
      category,
      city,
      neighborhood,
      whatsapp,
      instagram: normalizeInstagram(String(form.get('instagram') || '')),
      startingPrice,
      schedule: String(form.get('schedule') || dashboardProfile.schedule.join(', '))
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      description,
      avatarUrl: String(form.get('avatarUrl') || dashboardProfile.avatarUrl),
      students: Number(form.get('students') || dashboardProfile.students || 0),
      followers: Number(form.get('followers') || dashboardProfile.followers || 0),
      likes: Number(form.get('likes') || dashboardProfile.likes || 0),
      homeCare: form.get('homeCare') === 'on',
      onlineCare: form.get('onlineCare') === 'on',
    };
    savedProfile.plan = 'pro';
    savedProfile.planStatus = getPlanStatus(savedProfile);

    try {
      await saveProfessionalProfile(savedProfile);
      setDashboardProfile(savedProfile);
      setHasPublishedProfile(true);
      setIsEditing(false);
      toast('Perfil publicado', 'Agora ele aparece na busca e nos filtros do Explorar.');
    } catch {
      toast('Nao foi possivel salvar', 'Confira as regras do Firestore e tente novamente.');
    }
  }

  if (isLoading) {
    return <div className="section-shell min-h-[70vh] pt-8 text-lg font-extrabold">Carregando permissao...</div>;
  }

  if (!firebaseUser) {
    return (
      <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Lock className="h-10 w-10 text-violetGlow" />
        <h1 className="mt-4 text-3xl font-extrabold">Entre para acessar o painel profissional</h1>
        <p className="mt-3 max-w-md text-zinc-500 dark:text-zinc-300">Somente contas profissionais podem editar perfis publicos no ConectaFit.</p>
      </div>
    );
  }

  if (appUser?.role !== 'professional') {
    return (
      <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Lock className="h-10 w-10 text-violetGlow" />
        <h1 className="mt-4 text-3xl font-extrabold">Painel exclusivo para profissionais</h1>
        <p className="mt-3 max-w-md text-zinc-500 dark:text-zinc-300">
          Esta conta foi cadastrada como usuario. Para divulgar servicos, crie uma conta profissional.
        </p>
      </div>
    );
  }

  async function copyPix(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast(`${label} copiado`, 'Agora e so colar no app do banco.');
    } catch {
      toast('Nao consegui copiar', 'Selecione e copie manualmente.');
    }
  }

  return (
    <div className="section-shell pb-28 pt-8">
      <motion.div {...fadeUp} className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violetGlow">Dashboard profissional</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl">Controle sua presenca no ConectaFit.</h1>
          <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
            Edite perfil, destaque servicos, acompanhe leads, cliques e responda avaliacoes em uma operacao enxuta.
          </p>
        </div>
        <Button onClick={() => toast('Servico destacado', 'Este destaque pode ser conectado a um plano pago.')}>
          <TrendingUp className="h-5 w-5" />
          Destacar servico
        </Button>
      </motion.div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {stats.map(([Icon, value, label]) => (
          <div key={String(label)} className="premium-card p-6">
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violetGlow/15 text-violetGlow">
                <Icon className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-fitGreen/15 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-fitGreen">Live</span>
            </div>
            <p className="mt-6 text-3xl font-extrabold">{String(value)}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-500 dark:text-zinc-300">{String(label)}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <div className="glass-panel rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-violetGlow">ConectaFit Pro</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">R$ 25,00/mês</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Todo profissional ganha 30 dias gratis a partir da primeira publicacao do perfil. Depois disso, a mensalidade mantem o perfil ativo e com prioridade no marketplace.
              </p>
            </div>
            <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${isExpired ? 'bg-red-500/10 text-red-600' : 'bg-fitGreen/15 text-emerald-700 dark:text-fitGreen'}`}>
              <BadgeCheck className="h-4 w-4" />
              {currentPlanStatus === 'trial' ? `${trialDaysLeft} dias gratis` : currentPlanStatus === 'active' ? 'Plano ativo' : 'Pagamento pendente'}
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {['Prioridade na busca', 'Perfil com selo Pro', 'Metricas e leads'].map((benefit) => (
              <div key={benefit} className="rounded-3xl bg-white/70 p-4 text-sm font-bold dark:bg-white/10">
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {isExpired && (
          <div className="premium-card p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-fitGreen dark:bg-white dark:text-ink">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold">Pagar via Pix</h3>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-300">Envie o comprovante depois do pagamento.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 rounded-3xl bg-zinc-50 p-4 dark:bg-white/10">
              <p className="text-sm"><span className="font-extrabold">Banco:</span> {pixPayment.bank}</p>
              <p className="text-sm"><span className="font-extrabold">Titular:</span> {pixPayment.receiver}</p>
              <p className="text-sm"><span className="font-extrabold">Chave Pix:</span> {pixPayment.key}</p>
              <p className="text-sm"><span className="font-extrabold">Valor:</span> R$ {pixPayment.amount},00</p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button type="button" onClick={() => void copyPix(pixPayment.key, 'Chave Pix')}>
                <Copy className="h-5 w-5" />
                Copiar Pix
              </Button>
              <Button type="button" variant="secondary" onClick={() => void copyPix(formatPixMessage(dashboardProfile.name), 'Descricao')}>
                <Copy className="h-5 w-5" />
                Copiar descricao
              </Button>
            </div>
          </div>
        )}
      </section>

      {hasPublishedProfile && !isEditing && (
        <section className="mt-8 glass-panel rounded-[36px] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr_auto] lg:items-center">
            <div className="aspect-square overflow-hidden rounded-[30px] bg-zinc-100 dark:bg-white/10">
              <img src={dashboardProfile.avatarUrl} alt={dashboardProfile.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-violetGlow">Perfil publicado</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">{dashboardProfile.name}</h2>
              <p className="mt-2 font-bold text-zinc-500 dark:text-zinc-300">{dashboardProfile.specialty}</p>
              <p className="mt-4 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-300">{dashboardProfile.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
                <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">{dashboardProfile.neighborhood}, {dashboardProfile.city}</span>
                <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">R$ {dashboardProfile.startingPrice}</span>
                <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/10">{dashboardProfile.students} alunos</span>
              </div>
            </div>
            <Button type="button" onClick={() => setIsEditing(true)}>
              <Save className="h-5 w-5" />
              Editar perfil
            </Button>
          </div>
        </section>
      )}

      {isEditing && (
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <form key={dashboardProfile.id} onSubmit={handleSave} className="glass-panel rounded-[36px] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold">{hasPublishedProfile ? 'Editar perfil' : 'Criar perfil profissional'}</h2>
              <p className="mt-1 text-sm font-semibold text-zinc-500 dark:text-zinc-300">
                {hasPublishedProfile ? 'Atualize seus dados e salve para publicar novamente.' : 'Preencha uma vez para aparecer no Explorar.'}
              </p>
            </div>
            <div className="flex gap-2">
              {hasPublishedProfile && (
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              )}
              <Button type="submit">
                <Save className="h-5 w-5" />
                Salvar
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['Nome', 'name', dashboardProfile.name],
              ['Especialidade', 'specialty', dashboardProfile.specialty],
              ['Bairro', 'neighborhood', dashboardProfile.neighborhood],
              ['WhatsApp', 'whatsapp', dashboardProfile.whatsapp],
              ['Link do Instagram', 'instagram', dashboardProfile.instagram ? `https://instagram.com/${dashboardProfile.instagram}` : ''],
              ['Valor inicial', 'startingPrice', String(dashboardProfile.startingPrice)],
              ['Horarios', 'schedule', dashboardProfile.schedule.join(', ')],
            ].map(([label, name, value]) => (
              <label key={label} className="block">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">{label}</span>
                <input
                  name={name}
                  defaultValue={value}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
                />
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Cidade</span>
              <select
                name="city"
                defaultValue={normalizeCityLabel(dashboardProfile.city)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
              >
                {supportedCities.map((cityOption) => (
                  <option key={cityOption} value={cityOption}>
                    {cityOption}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Categoria</span>
              <select
                name="category"
                defaultValue={dashboardProfile.category}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
              >
                <option value="personal">Personal Trainer</option>
                <option value="nutricao">Nutricionista</option>
                <option value="psicologia">Psicologo</option>
                <option value="fisio">Fisioterapeuta</option>
                <option value="estetica">Estetica</option>
                <option value="nails">Nail Designer</option>
                <option value="massagem">Massagista</option>
                <option value="academias">Academia ou Studio</option>
                <option value="lojas">Loja fitness ou suplementos</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Alunos atendidos</span>
              <input
                name="students"
                type="number"
                min={0}
                defaultValue={dashboardProfile.students}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Seguidores</span>
              <input
                name="followers"
                type="number"
                min={0}
                defaultValue={dashboardProfile.followers}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Curtidas</span>
              <input
                name="likes"
                type="number"
                min={0}
                defaultValue={dashboardProfile.likes}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
              />
            </label>
          </div>
          <div className="mt-4 rounded-[28px] border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/10">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Foto do perfil</span>
            <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-zinc-100 dark:bg-white/10">
                <img src={photoPreview} alt={dashboardProfile.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white transition hover:scale-[1.01] dark:bg-white dark:text-ink">
                  <Upload className="h-5 w-5" />
                  Escolher foto
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handlePhotoFile(event.target.files?.[0])} />
                </label>
                <input
                  name="avatarUrl"
                  value={dashboardProfile.avatarUrl}
                  onChange={(event) => {
                    setDashboardProfile((current) => ({ ...current, avatarUrl: event.target.value }));
                    setPhotoPreview(event.target.value);
                  }}
                  placeholder="Ou cole uma URL da foto"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-ink"
                />
                <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-300">
                  No plano Spark, o upload fica salvo no perfil como imagem embutida ou URL. Quando o Storage estiver liberado, conectamos o envio definitivo.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/10">
              <UserPlus className="h-5 w-5 text-violetGlow" />
              <p className="mt-3 text-2xl font-extrabold">{dashboardProfile.students}</p>
              <p className="text-xs font-bold text-zinc-500">alunos</p>
            </div>
            <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/10">
              <Users className="h-5 w-5 text-violetGlow" />
              <p className="mt-3 text-2xl font-extrabold">{dashboardProfile.followers}</p>
              <p className="text-xs font-bold text-zinc-500">seguidores</p>
            </div>
            <div className="rounded-3xl bg-white/70 p-5 dark:bg-white/10">
              <Heart className="h-5 w-5 text-violetGlow" />
              <p className="mt-3 text-2xl font-extrabold">{dashboardProfile.likes}</p>
              <p className="text-xs font-bold text-zinc-500">curtidas</p>
            </div>
          </div>
          <label className="mt-4 block">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Descricao</span>
            <textarea
              name="description"
              defaultValue={dashboardProfile.description}
              rows={5}
              className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold leading-6 outline-none dark:border-white/10 dark:bg-ink"
            />
          </label>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-2xl bg-white/70 p-4 text-sm font-bold dark:bg-white/10">
              Atendimento domiciliar
              <input name="homeCare" type="checkbox" defaultChecked={dashboardProfile.homeCare} className="h-5 w-5 accent-fitGreen" />
            </label>
            <label className="flex items-center justify-between rounded-2xl bg-white/70 p-4 text-sm font-bold dark:bg-white/10">
              Atendimento online
              <input name="onlineCare" type="checkbox" defaultChecked={dashboardProfile.onlineCare} className="h-5 w-5 accent-fitGreen" />
            </label>
          </div>
        </form>

        <div className="space-y-6">
          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Galeria</h2>
              <button aria-label="Adicionar foto" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white dark:bg-white dark:text-ink">
                <ImagePlus className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {dashboardProfile.gallery.map((image) => (
                <div key={image} className="relative overflow-hidden rounded-3xl">
                  <img src={image} alt="Galeria" className="aspect-square object-cover" />
                  <div className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white/80 backdrop-blur-xl">
                    <Camera className="h-4 w-4 text-ink" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card p-6">
            <h2 className="text-xl font-extrabold">Responder avaliacoes</h2>
            <div className="mt-5 space-y-3">
              {reviews.slice(0, 2).map((review) => (
                <div key={review.id} className="rounded-3xl bg-zinc-50 p-4 dark:bg-white/10">
                  <p className="text-sm font-bold">{review.userName}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-300">{review.comment}</p>
                  <button className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-violetGlow">
                    <MessageSquareReply className="h-4 w-4" />
                    Responder
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
