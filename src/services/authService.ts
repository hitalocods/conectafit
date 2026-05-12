import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { firestoreCollections } from '../firebase/schema';
import type { UserRole } from '../types';

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(name: string, email: string, password: string, role: UserRole) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await setDoc(doc(db, firestoreCollections.users, credential.user.uid), {
    name,
    email,
    role,
    createdAt: serverTimestamp(),
  });
  return credential;
}

export async function loginWithGoogle(role: UserRole = 'client') {
  const credential = await signInWithPopup(auth, googleProvider);
  await setDoc(
    doc(db, firestoreCollections.users, credential.user.uid),
    {
      name: credential.user.displayName,
      email: credential.user.email,
      role,
      avatarUrl: credential.user.photoURL,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return credential;
}

export function logout() {
  return signOut(auth);
}
