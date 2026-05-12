export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-zinc-200/80 dark:bg-white/10 ${className}`} />;
}
