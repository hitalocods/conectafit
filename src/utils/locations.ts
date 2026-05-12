export const supportedCities = ['Teresina', 'Timon'] as const;

export type SupportedCity = (typeof supportedCities)[number];

export function normalizeCityLabel(value: string) {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  if (normalized.includes('timon')) return 'Timon';
  if (normalized.includes('teresina')) return 'Teresina';
  return value.trim();
}
