#!/bin/bash

# FormaFlow - Push vers GitHub
# Usage: bash push-to-github.sh VOTRE_USERNAME VOTRE_REPO

USERNAME=$1
REPO=$2

if [ -z "$USERNAME" ] || [ -z "$REPO" ]; then
  echo "Usage: bash push-to-github.sh username repo-name"
  echo "Exemple: bash push-to-github.sh johndoe formaflow"
  exit 1
fi

echo "🔧 Initialisation Git..."
git init

echo "📦 Ajout des fichiers..."
git add .

echo "💾 Commit..."
git commit -m "FormaFlow MVP - Initial commit

Features:
- Landing page complète
- Dashboard instructor avec éditeur de cours
- Authentification Clerk
- Base de données PostgreSQL + Prisma
- Marketplace public
- Lecteur de cours avec progression
- Intégration Stripe paiements
- Tests Jest"

echo "🔗 Connexion au remote..."
git remote add origin "https://github.com/$USERNAME/$REPO.git" 2>/dev/null || git remote set-url origin "https://github.com/$USERNAME/$REPO.git"

echo "⬆️ Push vers GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Projet pushé sur https://github.com/$USERNAME/$REPO"
echo ""
echo "Prochaine étape: Connecter le repo à Vercel"
echo "👉 https://vercel.com/new"