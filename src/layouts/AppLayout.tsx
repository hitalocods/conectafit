import { Outlet, Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, Moon, Search, Sparkles, Sun, UserRound } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { cx } from '../utils/format';

const publicNavItems = [
  { to: '/', label: 'Inicio' },
  { to: '/explorar', label: 'Explorar' },
];

export function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const { firebaseUser, appUser } = useAuth();
  const firstName = appUser?.name?.split(' ')[0] ?? firebaseUser?.displayName?.split(' ')[0] ?? firebaseUser?.email?.split('@')[0];
  const navItems = appUser?.role === 'professional' ? [...publicNavItems, { to: '/dashboard', label: 'Profissionais' }] : publicNavItems;
  const currentMobileNavItems = firebaseUser ? [...navItems, { to: '/minha-conta', label: 'Perfil' }] : [...navItems, { to: '/auth', label: 'Entrar' }];

  return (
    <div className="min-h-screen overflow-hidden bg-fog text-ink dark:bg-ink dark:text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violetGlow/20 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-fitGreen/10 blur-3xl" />
        <div className="absolute inset-0 bg-[length:28px_28px] [background-image:var(--bg-grid)] opacity-40" />
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-white/72 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/70">
        <div className="section-shell flex h-18 items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-3">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.04 }}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-fitGreen shadow-glow dark:bg-white dark:text-ink"
            >
              <Sparkles className="h-5 w-5" />
            </motion.span>
            <div>
              <p className="text-lg font-extrabold tracking-tight">ConectaFit</p>
              <p className="hidden text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:block">Health marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-black/5 bg-white/70 p-1 dark:border-white/10 dark:bg-white/5 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    isActive ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-zinc-600 hover:text-ink dark:text-zinc-300 dark:hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/explorar"
              aria-label="Buscar"
              className="grid h-11 w-11 place-items-center rounded-full border border-black/5 bg-white/80 transition hover:scale-105 dark:border-white/10 dark:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              aria-label="Alternar tema"
              onClick={toggleTheme}
              className="grid h-11 w-11 place-items-center rounded-full border border-black/5 bg-white/80 transition hover:scale-105 dark:border-white/10 dark:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {firebaseUser ? (
              <Link
                to="/minha-conta"
                className="hidden items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-premium transition hover:scale-[1.02] dark:bg-white dark:text-ink sm:flex"
              >
                <UserRound className="h-4 w-4" />
                {firstName}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="hidden items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-premium transition hover:scale-[1.02] dark:bg-white dark:text-ink sm:flex"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                Entrar
              </Link>
            )}
            {firebaseUser ? (
              <Link
                to="/minha-conta"
                aria-label="Abrir minha conta"
                className="grid h-11 w-11 place-items-center rounded-full bg-fitGreen text-ink transition hover:scale-105 sm:hidden"
              >
                <UserRound className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/auth"
                aria-label="Entrar ou cadastrar"
                className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition hover:scale-105 dark:bg-white dark:text-ink sm:hidden"
              >
                <UserRound className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-20">
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-4 bottom-4 z-40 grid rounded-[28px] border border-black/10 bg-white/85 p-2 shadow-premium backdrop-blur-2xl dark:border-white/10 dark:bg-ink/85 md:hidden"
        style={{ gridTemplateColumns: `repeat(${currentMobileNavItems.length}, minmax(0, 1fr))` }}
      >
        {currentMobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cx('rounded-2xl px-2 py-3 text-center text-xs font-bold', isActive ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-zinc-500')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
