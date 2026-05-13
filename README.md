# 🎓 DiploChain : Système de Certification Blockchain 🇧🇫

DiploChain est une infrastructure décentralisée de gestion et de vérification des titres académiques pour le Burkina Faso. Elle sécurise l'intégrité des diplômes contre la falsification et rationalise les processus de recrutement.

## 🛠 Architecture Technique

L'application repose sur une pile technologique moderne et sécurisée :

- **Frontend** : React 18+ avec Vite.
- **Styling** : Tailwind CSS avec un design "Swiss-Modern" haute fidélité.
- **Animations** : Motion/React pour des transitions d'états fluides et immersives.
- **Services Core** : 
  - `blockchainService.ts` : Simule l'interaction avec un registre distribué (Smart Contracts).
  - `cryptoService.ts` : Gère le hachage SHA-256 et les signatures électroniques (ECDSA).

## 🔐 Flux Cryptographique

1.  **Saisie** : L'Institution saisit les métadonnées du diplôme (Nom, Mention, Année).
2.  **Hachage** : Création d'une empreinte numérique unique (Hash SHA-256).
3.  **Signature** : L'institution signe le hash avec sa clé privée (Identité vérifiée).
4.  **Ancrage** : Le certificat signé est inscrit de manière immuable sur la blockchain.
5.  **Vérification** : Un recruteur scanne le QR code, recalcule le hash et vérifie la validité de la signature institutionnelle.

## 🚀 Guide de Déploiement

### Prérequis
- Node.js 18.x ou supérieur
- npm ou yarn

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

## 📂 Structure du Projet
- `/src/components` : Modules UI (Espace Universitaire, Wallet Étudiant, Scanner Recruteur).
- `/src/services` : Moteurs de calcul cryptographique et logique blockchain.
- `/src/lib` : Utilitaires de configuration thématique et Tailwind.
