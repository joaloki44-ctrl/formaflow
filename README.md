# FormaFlow - MVP LMS

## 📁 Structure du projet

```
formaflow/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout avec Clerk
│   ├── globals.css           # Styles Tailwind
│   ├── dashboard/
│   │   ├── layout.tsx        # Layout protégé
│   │   ├── page.tsx          # Dashboard instructor
│   │   └── courses/
│   │       └── new/
│   │           └── page.tsx  # Créer formation
│   └── (learner)/
│       └── courses/
│           └── page.tsx      # Marketplace cours
├── components/
│   ├── landing/              # Sections landing page
│   │   ├── Hero.tsx
│   │   ├── Mission.tsx
│   │   ├── Comparison.tsx
│   │   ├── Features.tsx
│   │   └── CTA.tsx
│   ├── layout/               # Header/Footer
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── dashboard/            # Interface instructor
│   │   ├── Sidebar.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── CoursesList.tsx
│   │   └── courses/
│   │       └── CourseForm.tsx
│   └── learner/              # Vue apprenant
│       ├── HeroLearner.tsx
│       └── CourseGrid.tsx
├── lib/
│   └── prisma.ts            # Connexion DB
├── middleware.ts            # Auth Clerk
├── prisma/
│   └── schema.prisma        # Modèles complèts
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 🚀 Stack technique

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM** + PostgreSQL
- **Clerk** Authentication
- **Framer Motion** Animations
- **Lucide React** Icons

## ✅ Fonctionnalités MVP

### Landing Page
- [x] Hero section avec CTA
- [x] Section Mission (3 cards)
- [x] Comparaison Sans/Avec
- [x] Grid de 15+ features
- [x] CTA final
- [x] Header/Footer responsive

### Dashboard Instructor
- [x] Layout avec Sidebar
- [x] Statistiques (courses, students, revenue)
- [x] Liste des formations
- [x] Créer une formation (form)
- [x] Navigation active states

### Auth
- [x] Middleware Clerk
- [x] Routes protégées
- [x] Bouton User

### API
- [x] GET/POST /api/courses

### BDD Models
- [x] User (instructor/student)
- [x] Course
- [x] Module
- [x] Lesson
- [x] Quiz
- [x] Enrollment
- [x] Progress
- [x] Certificate

## 📝 À faire pour MVP complet

1. [ ] Créer le dossier `(learner)/courses/page.tsx`
2. [ ] Page détail cours `/courses/[id]`
3. [ ] Page lecteur `/courses/[id]/lesson/[lessonId]`
4. [ ] Webhook Clerk sync user avec Prisma
5. [ ] Ajouter plus de routes API (modules, lessons)
6. [ ] Page analytics/statistiques
7. [ ] Éditeur de contenu (blocks)

## 🎨 Design System

- **Primary:** #1a1a1a (noir)
- **Secondary:** #ff6b4a (orange corail)
- **Accent:** #6366f1 (indigo)
- **Background:** #faf9f6 (crème)
- **Font:** Space Grotesk + Instrument Serif

## 🚜 Lancer le projet

```bash
# 1. Installer dépendances
npm install

# 2. Configurer .env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# 3. Push Prisma
npx prisma db push

# 4. Dev server
npm run dev
```

## 📦 Deploy

Le projet est prêt pour Vercel avec PostgreSQL (Neon/Supabase).