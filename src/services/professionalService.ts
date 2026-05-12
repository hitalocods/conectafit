import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { firestoreCollections } from '../firebase/schema';
import { professionals, reviews } from '../data/mockData';
import type { Filters, Lead, Professional, Review } from '../types';
import { normalizeCityLabel } from '../utils/locations';
import { createTrialDates, getPlanStatus, isPlanVisible } from '../utils/subscription';

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function normalizeCategory(value: string) {
  const normalized = normalizeText(value);
  if (normalized.includes('massag')) return 'massagem';
  if (normalized.includes('nutri')) return 'nutricao';
  if (normalized.includes('psico')) return 'psicologia';
  if (normalized.includes('fisio')) return 'fisio';
  if (normalized.includes('estet')) return 'estetica';
  if (normalized.includes('nail') || normalized.includes('unha')) return 'nails';
  if (normalized.includes('academ') || normalized.includes('studio')) return 'academias';
  if (normalized.includes('loja') || normalized.includes('suplement')) return 'lojas';
  if (normalized.includes('personal')) return 'personal';
  return value;
}

function normalizeCity(value: string) {
  return normalizeText(normalizeCityLabel(value));
}

function applyFilters(items: Professional[], filters?: Partial<Filters>): Professional[] {
  return items.filter((professional) => {
    if (filters?.category && professional.category !== filters.category) return false;
    if (filters?.city && normalizeCity(professional.city) !== normalizeCity(filters.city)) return false;
    if (filters?.neighborhood && !normalizeText(professional.neighborhood).includes(normalizeText(filters.neighborhood))) return false;
    if (filters?.maxPrice && professional.startingPrice > filters.maxPrice) return false;
    if (filters?.minRating && professional.rating < filters.minRating) return false;
    if (filters?.homeCare && !professional.homeCare) return false;
    if (filters?.onlineCare && !professional.onlineCare) return false;
    return true;
  });
}

function toProfessional(id: string, data: Partial<Professional>): Professional {
  const trialDates = data.trialStartedAt && data.trialEndsAt ? { trialStartedAt: data.trialStartedAt, trialEndsAt: data.trialEndsAt } : createTrialDates();
  const planStatus = getPlanStatus({
    trialEndsAt: trialDates.trialEndsAt,
    paidUntil: data.paidUntil,
    planStatus: data.planStatus || 'trial',
  });

  return {
    id,
    name: data.name || 'Profissional ConectaFit',
    specialty: data.specialty || 'Especialista em bem-estar',
    category: normalizeCategory(data.category || data.specialty || ''),
    city: data.city || 'Teresina',
    neighborhood: data.neighborhood || 'Teresina',
    description: data.description || 'Perfil profissional cadastrado no ConectaFit.',
    avatarUrl:
      data.avatarUrl ||
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    gallery: data.gallery?.length ? data.gallery : [],
    rating: data.rating ?? 5,
    reviewCount: data.reviewCount ?? 0,
    whatsapp: data.whatsapp || '',
    instagram: data.instagram || '',
    schedule: data.schedule?.length ? data.schedule : ['Seg a Sex, horario comercial'],
    startingPrice: Number(data.startingPrice || 100),
    homeCare: Boolean(data.homeCare),
    onlineCare: Boolean(data.onlineCare),
    featured: Boolean(data.featured),
    distanceKm: Number(data.distanceKm || 2),
    clicks: Number(data.clicks || 0),
    leads: Number(data.leads || 0),
    students: Number(data.students || 0),
    followers: Number(data.followers || 0),
    likes: Number(data.likes || 0),
    plan: 'pro',
    planStatus,
    trialStartedAt: trialDates.trialStartedAt,
    trialEndsAt: trialDates.trialEndsAt,
    paidUntil: data.paidUntil,
  };
}

function sortProfessionals(items: Professional[]) {
  return [...items].sort((a, b) => {
    const aVisible = isPlanVisible(a) ? 1 : 0;
    const bVisible = isPlanVisible(b) ? 1 : 0;
    if (aVisible !== bVisible) return bVisible - aVisible;
    if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
    return b.rating - a.rating;
  });
}

export function listProfessionals(filters?: Partial<Filters>): Professional[] {
  return sortProfessionals(applyFilters(professionals, filters));
}

export async function listProfessionalsFromFirestore(filters?: Partial<Filters>): Promise<Professional[]> {
  const snapshot = await getDocs(collection(db, firestoreCollections.professionals));
  const firestoreProfessionals = snapshot.docs.map((item) => toProfessional(item.id, item.data() as Partial<Professional>));
  const merged = [...firestoreProfessionals, ...professionals.filter((mock) => !firestoreProfessionals.some((item) => item.id === mock.id))];
  return sortProfessionals(applyFilters(merged, filters));
}

export function getProfessionalById(id: string): Professional | undefined {
  return professionals.find((professional) => professional.id === id);
}

export async function getProfessionalByIdFromFirestore(id: string): Promise<Professional | undefined> {
  const snapshot = await getDoc(doc(db, firestoreCollections.professionals, id));
  if (snapshot.exists()) return toProfessional(snapshot.id, snapshot.data() as Partial<Professional>);
  return getProfessionalById(id);
}

export async function getSavedProfessionalProfile(id: string): Promise<Professional | undefined> {
  const snapshot = await getDoc(doc(db, firestoreCollections.professionals, id));
  return snapshot.exists() ? toProfessional(snapshot.id, snapshot.data() as Partial<Professional>) : undefined;
}

export function listReviews(professionalId?: string): Review[] {
  return professionalId ? reviews.filter((review) => review.professionalId === professionalId) : reviews;
}

export async function saveProfessionalProfile(professional: Professional) {
  return setDoc(doc(db, firestoreCollections.professionals, professional.id), professional, { merge: true });
}

export async function createLead(lead: Omit<Lead, 'id' | 'createdAt'>) {
  return addDoc(collection(db, firestoreCollections.leads), {
    ...lead,
    createdAt: serverTimestamp(),
  });
}

export async function createReview(review: Omit<Review, 'id' | 'date'>) {
  return addDoc(collection(db, firestoreCollections.reviews), {
    ...review,
    date: serverTimestamp(),
  });
}
