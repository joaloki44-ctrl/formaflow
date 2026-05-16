# Déploiement FormaFlow - Guide Complet

## Option 1 : Déploiement Vercel (Recommandé)

### Étape 1 : Prérequis
- Compte [Vercel](https://vercel.com)
- Base de données PostgreSQL ([Neon](https://neon.tech) ou [Supabase](https://supabase.com))
- Compte [Clerk](https://clerk.dev)
- Compte [Stripe](https://stripe.com) (optionnel)

### Étape 2 : Configuration Git
```bash
# Initialiser le repo
git init
git add .
git commit -m "Initial commit"

# Créer repo GitHub et push
git remote add origin https://github.com/votre-username/formaflow.git
git push -u origin main
```

### Étape 3 : Variables d'environnement Vercel
Dans le dashboard Vercel, ajoutez ces variables :

```
# Base de données
DATABASE_URL=postgresql://...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

### Étape 4 : Déployer
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

## Option 2 : Déploiement Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Installer dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### docker-compose.yaml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/formaflow
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: formaflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Option 3 : Déploiement Railway / Render

### Railway
1. Connecter repo GitHub
2. Ajouter PostgreSQL addon
3. Configurer variables d'environnement
4. Déployer automatiquement

### Render
1. Créer Web Service
2. Sélectionner repo GitHub
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm start`

## Post-déploiement

### 1. Configurer Webhooks
Dans Clerk Dashboard :
- Endpoint: `https://votre-site.vercel.app/api/webhook/clerk`
- Sélectionner: `user.created`, `user.updated`, `user.deleted`

Dans Stripe Dashboard :
- Endpoint: `https://votre-site.vercel.app/api/webhook/stripe`
- Sélectionner: `checkout.session.completed`

### 2. Migrer la base de données
```bash
npx prisma db push
# ou
npx prisma migrate deploy
```

### 3. Tester
- [ ] Landing page accessible
- [ ] Inscription / Connexion fonctionne
- [ ] Création de formation
- [ ] Paiement test (Stripe test mode)

## 🔧 Dépannage

### Erreur Prisma
```bash
# Régénérer le client
npx prisma generate
```

### Build échoue
Vérifier que toutes les variables d'environnement sont définies.

### Webhooks ne fonctionnent pas
Vérifier : 
- URL correcte
- Signature webhook (`whsec_...`)
- Méthode POST autorisée

---

**Projet prêt pour le déploiement !** 🚀