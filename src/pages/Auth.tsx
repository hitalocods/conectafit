import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Search, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../services/authService';
import type { UserRole } from '../types';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('client');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsLoading(true);
    try {
      if (mode === 'register') {
        await registerWithEmail(String(form.get('name')), String(form.get('email')), String(form.get('password')), role);
        toast('Cadastro criado', 'Seu perfil ja esta conectado ao Firebase Authentication.');
        navigate(role === 'professional' ? '/dashboard' : '/', { replace: true });
      } else {
        await loginWithEmail(String(form.get('email')), String(form.get('password')));
        toast('Login realizado', 'Bem-vindo de volta ao ConectaFit.');
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast('Nao foi possivel autenticar', getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogle() {
    setIsLoading(true);
    try {
      await loginWithGoogle(role);
      toast('Google Login conectado');
      navigate(role === 'professional' ? '/dashboard' : '/', { replace: true });
    } catch (error) {
      toast('Nao foi possivel entrar com Google', getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="section-shell grid min-h-[calc(100vh-5rem)] items-center gap-8 pb-36 pt-10 sm:pb-16 lg:grid-cols-[.95fr_1.05fr]">
      <div>
        <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violetGlow">Conta</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Entre para uma rede feita para conversao.</h1>
        <p className="mt-5 max-w-xl leading-8 text-zinc-600 dark:text-zinc-300">
          Usuarios encontram os melhores especialistas. Profissionais gerenciam perfil, galeria, leads e avaliacoes em um painel moderno.
        </p>
      </div>

      <div className="glass-panel rounded-[36px] p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-2 rounded-full bg-zinc-100 p-1 dark:bg-white/10">
          {(['login', 'register'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-full px-4 py-3 text-sm font-extrabold ${mode === item ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-zinc-500'}`}
            >
              {item === 'login' ? 'Login' : 'Cadastro'}
            </button>
          ))}
        </div>
        {mode === 'register' && (
          <div className="mt-5 rounded-[28px] border border-black/10 bg-white/70 p-3 dark:border-white/10 dark:bg-white/10">
            <p className="px-2 pb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-400">Tipo de cadastro</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['client', 'professional'] as const).map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    role === item
                      ? 'border-violetGlow bg-violetGlow/10 text-violetGlow'
                      : 'border-black/10 bg-white text-zinc-600 hover:border-violetGlow/40 dark:border-white/10 dark:bg-ink dark:text-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={item}
                    checked={role === item}
                    onChange={() => setRole(item)}
                    className="mt-1 h-4 w-4 accent-violetGlow"
                  />
                  <span>
                    <span className="block text-sm font-extrabold">{item === 'client' ? 'Usuario' : 'Profissional'}</span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-zinc-500 dark:text-zinc-400">
                      {item === 'client' ? 'Quero encontrar servicos.' : 'Quero divulgar meu trabalho.'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-ink">
              <UserRound className="h-5 w-5 text-zinc-400" />
              <input name="name" required placeholder="Nome completo" className="w-full bg-transparent text-sm font-semibold outline-none" />
            </label>
          )}
          <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-ink">
            <Mail className="h-5 w-5 text-zinc-400" />
            <input name="email" type="email" required placeholder="Email" className="w-full bg-transparent text-sm font-semibold outline-none" />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-ink">
            <Lock className="h-5 w-5 text-zinc-400" />
            <input name="password" type="password" required minLength={6} placeholder="Senha" className="w-full bg-transparent text-sm font-semibold outline-none" />
          </label>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Conectando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </Button>
        </form>
        <button
          onClick={handleGoogle}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-extrabold dark:border-white/10 dark:bg-white/10"
        >
          <Search className="h-5 w-5" />
          Continuar com Google
        </button>
      </div>
    </div>
  );
}
