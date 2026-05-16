#!/bin/bash

# FormaFlow - Script de déploiement rapide

echo "🚀 Déploiement FormaFlow"
echo "========================"

# Vérifier les fichiers critiques
echo "📁 Vérification des fichiers..."

required_files=("package.json" "next.config.js" "vercel.json")
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Fichier manquant: $file"
    exit 1
  fi
done
echo "✅ Fichiers OK"

# Vérifier variables d'environnement
echo ""
echo "🔐 Vérification des variables d'environnement..."

if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
  echo "⚠️  Aucun fichier .env trouvé"
  echo "Créez un fichier .env.local avec les variables requises:"
  echo "  cp .env.local.example .env.local"
fi

# Commandes de déploiement
echo ""
echo "📦 Prêt pour le déploiement !"
echo ""
echo "Options de déploiement:"
echo ""
echo "1. Vercel (recommandé):"
echo "   npm i -g vercel"
echo "   vercel --prod"
echo ""
echo "2. Docker:"
echo "   docker-compose up -d"
echo ""
echo "3. Manuel:"
echo "   npm install"
echo "   npm run build"
echo "   npm start"
echo ""