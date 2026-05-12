import { FirebaseError } from 'firebase/app';

export function getFirebaseErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return 'Erro inesperado. Tente novamente.';
  }

  const messages: Record<string, string> = {
    'auth/api-key-not-valid': 'A API key do Firebase nao esta valida. Pare o servidor e rode npm run dev novamente.',
    'auth/configuration-not-found': 'O Authentication ainda nao esta configurado corretamente no Firebase.',
    'auth/email-already-in-use': 'Este email ja possui cadastro. Use Login em vez de Cadastro.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/invalid-email': 'Email invalido.',
    'auth/operation-not-allowed': 'Ative Email/Senha ou Google em Authentication > Metodo de login.',
    'auth/popup-closed-by-user': 'Login com Google cancelado antes de concluir.',
    'auth/unauthorized-domain': 'Adicione localhost em Authentication > Configuracoes > Dominios autorizados.',
    'auth/user-not-found': 'Usuario nao encontrado. Crie uma conta primeiro.',
    'auth/wrong-password': 'Senha incorreta.',
    'permission-denied': 'Sem permissao no Firestore. Confira as regras do banco de dados.',
  };

  return messages[error.code] || `${error.code}: ${error.message}`;
}
