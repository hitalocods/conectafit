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

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
