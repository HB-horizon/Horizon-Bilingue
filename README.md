# Horizon Bilingue - Apprendre l'Arabe en 30 Jours

Une application mobile éducative pour enseigner l'alphabet arabe aux enfants de 7 ans et plus.

## 🌟 Présentation

**Horizon Bilingue** est une application mobile progressive et ludique qui permet aux enfants d'apprendre les 29 lettres de l'alphabet arabe en 30 jours. À la fin du programme, l'enfant sera capable de lire sa première sourate : **Al-Fatiha**.

### Caractéristiques principales

- **30 jours de leçons** : Une lettre par jour avec progression douce
- **Approche narrative** : Histoires et personnages attachants (Bibi, Tata, etc.)
- **Gamification** : Système de badges, célébrations, et progression visible
- **Multimodalité** : Visuel, auditif, et kinesthésique
- **Hors ligne** : Fonctionne sans connexion internet
- **Vocabulaire coranique** : 436 mots du Coran dans 9 catégories, dont les 99 Noms d'Allah
- **Quiz & révisions** : Exercices de vocabulaire avec synthèse vocale arabe
- **Adapté aux enfants** : Interface colorée et intuitive

## 📱 Captures d'écran

L'application comprend :
- **Écran d'accueil** : Style "Mille et une nuits" avec logo animé
- **Tableau de bord** : Grille de 29 badges avec progression
- **Écrans de leçon** : Histoire, présentation, sons, formes, exercices, célébration
- **Guide parents** : Statistiques et conseils pédagogiques

## 🎯 Objectifs pédagogiques

À la fin du programme, l'enfant sera capable de :

- Reconnaître les 29 lettres de l'alphabet arabe
- Prononcer chaque lettre avec ses 3 voyelles (Fat7a, Damma, Kasra)
- Identifier les 4 formes de chaque lettre (isolée, début, milieu, fin)
- Comprendre le concept de prolongation (madd)
- Lire des mots simples en arabe
- Réciter la Sourate Al-Fatiha
- Comprendre 80% du vocabulaire coranique courant (436 mots, 9 catégories)
- Connaître les 99 Noms d'Allah (Asma'ul Husna)

## 🏗️ Architecture technique

### Stack technologique

- **Framework** : React Native avec Expo SDK 54
- **Langage** : TypeScript 5.9
- **Navigation** : Expo Router 6
- **Styling** : NativeWind 4 (Tailwind CSS)
- **Animations** : react-native-reanimated 4.x
- **Stockage local** : AsyncStorage
- **Audio** : expo-speech + Web Speech API (synthèse vocale arabe)

### Structure du projet

```
horizon-bilingue-mobile/
├── app/                      # Écrans de l'application
│   ├── (tabs)/              # Navigation par onglets
│   │   └── index.tsx        # Écran d'accueil
│   ├── dashboard/           # Tableau de bord
│   ├── lesson/              # Écrans de leçon
│   │   ├── [day].tsx        # Leçon dynamique (jours 1-29)
│   │   └── 30.tsx           # Jour 30 (Fatiha)
│   └── parent-guide/        # Guide pour parents
├── components/              # Composants réutilisables
│   ├── common/              # Composants génériques
│   │   └── badge-card.tsx   # Badge de jour
│   ├── lesson/              # Composants de leçon
│   │   ├── story-card.tsx
│   │   ├── letter-presentation.tsx
│   │   ├── sounds-section.tsx
│   │   ├── forms-section.tsx
│   │   ├── exercise-section.tsx
│   │   └── celebration-screen.tsx
│   └── screen-container.tsx # Container avec SafeArea
├── data/                    # Données des leçons
│   ├── lessons-days-1-4.ts  # Jours 1-4 (enrichis)
│   ├── lessons-days-5-29.ts # Jours 5-29 (standard)
│   ├── day-30-fatiha.ts     # Jour 30 (Fatiha)
│   ├── all-lessons.ts       # Index et utilitaires
│   └── quran-vocabulary.ts  # 436 mots du Coran (9 catégories, 99 noms d'Allah)
├── types/                   # Types TypeScript
│   ├── lesson.ts            # Types des leçons
│   └── vocabulary.ts        # Types du vocabulaire
├── lib/                     # Bibliothèques et utilitaires
│   ├── progress-manager.ts  # Gestion de la progression
│   ├── audio-manager.ts     # Synthèse vocale (expo-speech / Web Speech API)
│   ├── audio-synthesizer.ts # Générateur de sons (Web Audio API)
│   └── rewards-manager.ts   # Système de badges et récompenses
├── hooks/                   # Hooks personnalisés
│   └── use-progress.ts      # Hook de progression
├── assets/                  # Assets (images, icônes)
└── NOTICE_UTILISATION.md    # Notice complète

```

## 🚀 Installation et développement

### Prérequis

- Node.js 22.x
- pnpm 9.x
- Expo CLI
- iOS Simulator (Mac) ou Android Emulator

### Installation

```bash
# Cloner le projet
cd horizon-bilingue-mobile

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

### Test sur appareil

1. Installer l'application **Expo Go** sur votre appareil iOS ou Android
2. Scanner le QR code affiché dans le terminal
3. L'application se lance automatiquement

### Build production

```bash
# Build Android
pnpm android

# Build iOS
pnpm ios
```

## 📚 Structure des données

### Types principaux

```typescript
type DayLesson = {
  dayNumber: number;
  letter: string;
  latinName: string;
  exampleWord: string;
  exampleLatin: string;
  exampleImage: string;
  forms: LetterForms;
  harakatExamples: HarakatExample[];
  hasElongation?: boolean;
  elongationExercises?: ElongationExercise[];
  exerciseWords: ExerciseWord[];
  storyTitle?: string;
  storyContent?: string;
  storyCharacter?: string;
  mnemonicTip?: string;
  isSpecialDay?: boolean;
};

type UserProgress = {
  currentDay: number;
  completedDays: number[];
  badges: { [day: number]: boolean };
  lastVisit: Date;
  totalTime: number;
  dayStartTimes: { [day: number]: number };
};
```

### Progression

La progression est sauvegardée localement avec AsyncStorage :
- Jours complétés
- Badges débloqués
- Temps total passé
- Dernière visite

## 🎨 Design et UX

### Palette de couleurs

- **Primary** : `#FF6B6B` (rouge corail)
- **Background** : `#FFFFFF` (light) / `#1A365D` (dark)
- **Surface** : `#F7F9FC` (light) / `#2D3748` (dark)
- **Success** : `#48BB78`
- **Warning** : `#F6AD55`
- **Accent** : `#FFD700` (or)

### Animations

- Animations d'apparition (fade, slide, zoom)
- Pulsation pour le jour actuel
- Confettis et étoiles pour les célébrations
- Feedback visuel sur les interactions

## 📖 Utilisation

### Pour les enfants

1. **Commencer l'aventure** depuis l'écran d'accueil
2. **Cliquer sur le badge du jour 1** dans le tableau de bord
3. **Suivre les étapes** de la leçon :
   - Histoire (jours 1-4)
   - Présentation de la lettre
   - Écoute des sons
   - Découverte des formes
   - Pratique avec des mots
   - Célébration et badge
4. **Continuer chaque jour** jusqu'au jour 30

### Pour les parents

- Consulter le **Guide parents** depuis l'écran d'accueil
- Suivre la **progression** dans le tableau de bord
- Encourager la **régularité** (15 min/jour)
- Célébrer les **jalons** (jours 4, 10, 15, 20, 29, 30)
- Lire la **Notice d'utilisation** complète

## 🏆 Jalons spéciaux

- **Jour 4** : Badge "Champion des 4 jours"
- **Jour 10** : 1/3 du chemin parcouru
- **Jour 15** : Mi-parcours
- **Jour 20** : Plus que 9 lettres !
- **Jour 29** : Dernière lettre
- **Jour 30** : Diplôme final + Lecture de la Fatiha

## 🔧 Configuration

### Branding

Modifier `app.config.ts` :
```typescript
const env = {
  appName: "Horizon Bilingue",
  appSlug: "horizon-bilingue-mobile",
  logoUrl: "https://...",
};
```

### Audio

L'application utilise **expo-speech** (mobile) et **Web Speech API** (web) pour la synthèse vocale arabe :
- Lettres de l'alphabet prononcées avec leurs voyelles
- Mots d'exemple et vocabulaire coranique
- Sons de feedback (succès/erreur) via Web Audio API (oscillateurs)

Configuration de la voix arabe dans `lib/audio-manager.ts` :
```typescript
private getArabicVoice(): SpeechSynthesisVoice | undefined {
  return voices.find(v =>
    v.lang.startsWith('ar') ||
    v.name.includes('Arabic') ||
    v.name.includes('Hoda')
  );
}
```

### Thème

Modifier `theme.config.js` :
```javascript
const themeColors = {
  primary: { light: '#FF6B6B', dark: '#FF6B6B' },
  // ...
};
```

## 📝 TODO

Voir `todo.md` pour la liste complète des fonctionnalités implémentées et à venir.

### Vocabulaire coranique implémenté
- **436 mots** du Coran répartis en 9 catégories
- **Les 99 Noms d'Allah** complets (Asma'ul Husna)
- Données issues du document *80% des mots du Qour'ân*
- Synthèse vocale arabe intégrée via expo-speech

## 🤝 Contribution

Ce projet est un projet éducatif. Les contributions sont les bienvenues pour :
- Améliorer les animations et les interactions
- Enrichir le vocabulaire coranique
- Traduire l'interface en d'autres langues
- Ajouter d'autres méthodes d'apprentissage

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- **Manus AI** - Développement initial

## 🙏 Remerciements

- Communauté Expo pour le framework excellent
- Communauté React Native pour les bibliothèques
- Tous les parents et enfants qui testent l'application

---

**Bonne chance et bon apprentissage ! 🌟**
"# Horizon-Bilingue" 
# Horizon-Bilingue
