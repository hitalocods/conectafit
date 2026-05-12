export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappUrl(phone: string, name: string) {
  const message = encodeURIComponent(`Ola, encontrei seu perfil no ConectaFit e gostaria de agendar um horario com ${name}.`);
  return `https://wa.me/${phone}?text=${message}`;
}

export function normalizeInstagram(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const withoutQuery = trimmed.split('?')[0].replace(/\/$/, '');
  const match = withoutQuery.match(/(?:instagram\.com\/|@)([A-Za-z0-9._]+)/i);
  return (match?.[1] || withoutQuery).replace('@', '').replace(/^https?:\/\//, '').trim();
}

export function instagramUrl(value: string) {
  const username = normalizeInstagram(value);
  return username ? `https://instagram.com/${username}` : '';
}

export function instagramHandle(value: string) {
  const username = normalizeInstagram(value);
  return username ? `@${username}` : '';
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
