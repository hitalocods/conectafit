import type { Professional, ProfessionalPlanStatus } from '../types';

const trialDays = 30;
const dayMs = 24 * 60 * 60 * 1000;

export const pixPayment = {
  bank: 'Caixa Economica Federal',
  key: '86999540408',
  receiver: 'Hitalo Lacerda Gomes',
  amount: 25,
};

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * dayMs);
}

export function createTrialDates(baseDate = new Date()) {
  return {
    trialStartedAt: baseDate.toISOString(),
    trialEndsAt: addDays(baseDate, trialDays).toISOString(),
  };
}

export function getPlanStatus(professional: Pick<Professional, 'trialEndsAt' | 'paidUntil' | 'planStatus'>): ProfessionalPlanStatus {
  const now = Date.now();
  if (professional.paidUntil && new Date(professional.paidUntil).getTime() >= now) return 'active';
  if (professional.trialEndsAt && new Date(professional.trialEndsAt).getTime() >= now) return 'trial';
  return professional.planStatus === 'active' ? 'active' : 'expired';
}

export function getTrialDaysLeft(trialEndsAt: string) {
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / dayMs));
}

export function isPlanVisible(professional: Professional) {
  return getPlanStatus(professional) !== 'expired';
}

export function formatPixMessage(professionalName: string) {
  return `ConectaFit Pro - ${professionalName} - R$ ${pixPayment.amount},00/mês`;
}
