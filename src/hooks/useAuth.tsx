import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebase/config';
import { firestoreCollections } from '../firebase/schema';
import type { AppUser } from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setAppUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, firestoreCollections.users, user.uid));
        const data = snapshot.data() as Partial<AppUser> | undefined;
        setAppUser({
          id: user.uid,
          name: data?.name || user.displayName || user.email || 'Usuario',
          email: data?.email || user.email || '',
          role: data?.role || 'client',
          avatarUrl: data?.avatarUrl || user.photoURL || undefined,
        });
      } catch {
        setAppUser({
          id: user.uid,
          name: user.displayName || user.email || 'Usuario',
          email: user.email || '',
          role: 'client',
          avatarUrl: user.photoURL || undefined,
        });
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  const value = useMemo(() => ({ firebaseUser, appUser, isLoading }), [firebaseUser, appUser, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
