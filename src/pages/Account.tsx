import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, LogOut, Mail, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';

export default function Account() {
  const { firebaseUser, appUser, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="section-shell min-h-[70vh] pt-8 text-lg font-extrabold">Carregando sua conta...</div>;
  }

  if (!firebaseUser) {
    return <Navigate to="/auth" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="section-shell grid min-h-[calc(100vh-5rem)] items-center gap-8 pb-32 pt-10 lg:grid-cols-[.9fr_1.1fr]">
      <div>
        <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violetGlow">Minha conta</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">Seu perfil ConectaFit.</h1>
        <p className="mt-5 max-w-xl leading-8 text-zinc-600 dark:text-zinc-300">
          Aqui voce acessa seus dados, edita seu perfil profissional e sai da conta com seguranca.
        </p>
      </div>

      <div className="glass-panel rounded-[36px] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-3xl bg-ink text-fitGreen dark:bg-white dark:text-ink">
            {appUser?.avatarUrl ? <img src={appUser.avatarUrl} alt={appUser.name} className="h-full w-full object-cover" /> : <UserRound className="h-9 w-9" />}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-extrabold">{appUser?.name || firebaseUser.email}</h2>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-300">
              <Mail className="h-4 w-4" />
              {appUser?.email || firebaseUser.email}
            </p>
            <p className="mt-2 inline-flex rounded-full bg-violetGlow/10 px-3 py-1 text-xs font-extrabold text-violetGlow">
              {appUser?.role === 'professional' ? 'Profissional' : 'Usuario'}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {appUser?.role === 'professional' && (
            <Link to="/dashboard">
              <Button className="w-full">
                <BriefcaseBusiness className="h-5 w-5" />
                Editar perfil profissional
              </Button>
            </Link>
          )}
          <Button type="button" variant="secondary" className="w-full" onClick={() => void handleLogout()}>
            <LogOut className="h-5 w-5" />
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
}
