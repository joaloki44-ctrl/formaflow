# Guide de Tests - FormaFlow

## 🧪 Lancer les tests

```bash
# Tests une fois
npm test

# Tests en mode watch (développement)
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

## 📋 Scénarios testés

### 1. API Courses
- ✅ Récupération des cours publics
- ✅ Création de cours (authentifié)
- ✅ Gestion des erreurs

### 2. LessonEditor
- ✅ Parser JSON des blocs
- ✅ Gestion du contenu vide
- ✅ Metadata des blocs (images, vidéos)

### 3. Progression
- ✅ Calcul 0% (début)
- ✅ Calcul 50% (mi-parcours)
- ✅ Calcul 100% (terminé)

### 4. Scénario complet
- ✅ Création formation → Inscription → Progression → Certification
- ✅ Cours gratuit (sans paiement)

## 🎯 Couverture

| Module | Tests |
|--------|-------|
| API | courses, enrollments, progress |
| Composants | LessonEditor blocks |
| Intégration | Flows complets utilisateur |

## 📝 Ajouter un test

```typescript
import { describe, it, expect } from "@jest/globals";

describe("Nouveau feature", () => {
  it("devrait faire X quand Y", () => {
    const result = maFunction();
    expect(result).toBe("attendu");
  });
});
```