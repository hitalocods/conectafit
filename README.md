# ConectaFit

Marketplace web premium para profissionais de saude, bem-estar, estetica e fitness, com foco inicial em Teresina e Timon.

## Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- Lucide React
- Firebase Authentication, Firestore Database e Storage

## Funcionalidades

- Home page com hero, busca, categorias, profissionais em destaque, reviews e CTA profissional
- Login, cadastro, Google Login e diferenciacao de usuario comum/profissional
- Perfil profissional com foto, especialidade, localizacao, galeria, avaliacoes, horarios, valor inicial, Instagram e WhatsApp
- Filtros por categoria, bairro, cidade, preco, avaliacao, atendimento domiciliar e online
- Dashboard profissional com edicao de perfil, galeria, horarios, reviews, cliques e leads
- Dark mode, skeleton loading, empty states, toast notifications e SEO basico
- Estrutura escalavel em components, pages, hooks, services, firebase, layouts, types e utils

## Firebase

Crie um arquivo `.env.local` com:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Collections previstas:

- `users`
- `professionals`
- `reviews`
- `categories`
- `leads`
- `featuredProfessionals`

Regras recomendadas do Cloud Firestore para o MVP:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return signedIn() && request.auth.uid == userId;
    }

    function isProfessional(userId) {
      return exists(/databases/$(database)/documents/users/$(userId)) &&
        get(/databases/$(database)/documents/users/$(userId)).data.role == 'professional';
    }

    match /users/{userId} {
      allow read, create, update: if isOwner(userId);
      allow delete: if false;
    }

    match /professionals/{professionalId} {
      allow read: if true;
      allow create, update: if isOwner(professionalId) && isProfessional(professionalId);
      allow delete: if false;
    }

    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if signedIn();
      allow update, delete: if false;
    }

    match /leads/{leadId} {
      allow create: if true;
      allow read: if signedIn();
      allow update, delete: if false;
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }

    match /featuredProfessionals/{id} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Rodar localmente

```bash
npm install
npm run dev
```

No Windows, se o PowerShell bloquear `npm.ps1`, use:

```bash
npm.cmd run dev
```

Ou execute `start-dev.bat`.

Build de producao:

```bash
npm run build
```

## Observacao

O app inclui dados mockados para demonstracao visual e navegacao completa. Ao configurar as variaveis Firebase, os servicos em `src/services` ficam prontos para persistencia real.
