# Design de l'Application Mobile Horizon Bilingue

## Vue d'ensemble

Application mobile d'apprentissage de l'alphabet arabe destinée aux enfants de 7 ans, avec un parcours de 30 jours progressif et ludique. L'application utilise React Native avec Expo et suit les principes de design iOS (Apple Human Interface Guidelines).

## Orientation et Usage

- **Orientation** : Portrait uniquement (9:16)
- **Usage** : Une main, navigation simple
- **Public cible** : Enfants de 7 ans avec supervision parentale optionnelle

## Architecture de l'Information

### Écrans Principaux

#### 1. Écran d'Accueil (Home)
**Contenu** :
- Logo de l'application (croissant de lune avec étoiles)
- Titre "Horizon Bilingue"
- Sous-titre "Apprends l'arabe en 30 jours !"
- Personnage mascotte "Bibi" (bébé souriant)
- Bouton principal "Commencer l'aventure"
- Bouton secondaire "Guide pour parents"

**Fonctionnalité** :
- Animation d'entrée douce avec étoiles scintillantes
- Musique de fond optionnelle (activable/désactivable)
- Détection automatique du dernier jour complété

#### 2. Écran Tableau de Bord (Dashboard)
**Contenu** :
- Barre de progression globale (X/29 lettres maîtrisées)
- Grille de badges des 30 jours (5 colonnes × 6 lignes)
- Badge du jour actuel mis en évidence
- Badges débloqués en couleur, verrouillés en gris
- Bouton "Continuer" vers le prochain jour
- Bouton "Réviser" pour revoir les jours précédents

**Fonctionnalité** :
- Scroll vertical fluide
- Animation de confettis lors du déblocage d'un badge
- Tap sur un badge débloqué pour revoir la leçon

#### 3. Écran Leçon (Lesson)
**Contenu pour Jours 1-4 (version enrichie)** :
- En-tête : Numéro du jour + Lettre arabe
- Section 1 : Histoire narrative avec illustration
- Section 2 : Présentation de la lettre (animation de dessin)
- Section 3 : Les 3 sons de base (cartes interactives)
- Section 4 : Les 4 formes de la lettre
- Section 5 : Exercices de mots (6 cartes)
- Section 6 : Mini-jeu de reconnaissance
- Section 7 : Célébration et badge
- Barre de progression de la leçon (7 étapes)
- Bouton audio 🔊 sur chaque élément
- Bouton "Suivant" pour passer à l'étape suivante

**Contenu pour Jours 5-29 (version standard)** :
- En-tête : Numéro du jour + Lettre arabe
- Section 1 : Révision rapide (2-3 dernières lettres)
- Section 2 : Introduction courte
- Section 3 : Présentation de la lettre
- Section 4 : Les 3 sons + prolongations
- Section 5 : Exercices de mots (6 cartes)
- Section 6 : Mini-jeu
- Section 7 : Badge du jour
- Barre de progression (7 étapes)

**Contenu pour Jour 30** :
- Révision finale des 29 lettres
- Présentation de la Sourate Al-Fatiha
- Lecture guidée verset par verset
- Lecture autonome
- Traduction et explication
- Grande célébration finale
- Diplôme virtuel

**Fonctionnalité** :
- Navigation linéaire (pas de saut d'étapes)
- Sauvegarde automatique de la progression
- Audio répétable à l'infini
- Animations de réussite à chaque étape
- Feedback haptique sur les interactions importantes

#### 4. Écran Carte de Mot (Word Card)
**Contenu** :
- Grande lettre/mot arabe au centre
- Transcription latine en dessous
- Image/emoji illustratif
- Bouton audio 🔊
- Bouton "Afficher" pour révéler la traduction
- Étoile dorée après écoute

**Fonctionnalité** :
- Tap sur le mot pour entendre
- Animation de retournement pour la traduction
- Confettis lors de la première écoute

#### 5. Écran Mini-Jeu
**Types de jeux** :
- Reconnaissance de lettre (trouver la bonne parmi 4)
- Association son-lettre (écouter et choisir)
- Mémoire (paires de lettres)
- Son court ou long (pour les prolongations)
- Construction de syllabes (glisser-déposer)

**Fonctionnalité** :
- Feedback immédiat (✓ ou ✗)
- Sons de victoire/encouragement
- Score affiché à la fin
- Possibilité de rejouer

#### 6. Écran Guide Parents
**Contenu** :
- Présentation de la méthode
- Organisation recommandée (15-20 min/jour)
- Conseils pédagogiques
- Suivi de la progression de l'enfant
- Statistiques (temps passé, jours complétés)
- Paramètres (audio, vitesse, difficulté)

## Flux Utilisateur Principaux

### Flux 1 : Première Utilisation
1. Écran d'accueil → Tap "Commencer l'aventure"
2. Animation de transition
3. Tableau de bord (tous badges verrouillés sauf Jour 1)
4. Tap sur badge Jour 1
5. Leçon Jour 1 (7 étapes)
6. Célébration + Badge débloqué
7. Retour au tableau de bord (Jour 2 déverrouillé)

### Flux 2 : Utilisation Quotidienne
1. Écran d'accueil → Détection automatique du dernier jour
2. Bouton "Continuer" vers le prochain jour
3. Leçon du jour
4. Célébration
5. Retour au tableau de bord

### Flux 3 : Révision
1. Tableau de bord → Tap sur un badge débloqué
2. Leçon en mode révision (sans déblocage de nouveau badge)
3. Retour au tableau de bord

### Flux 4 : Parents
1. Écran d'accueil → "Guide pour parents"
2. Consultation des statistiques
3. Ajustement des paramètres
4. Retour à l'accueil

## Palette de Couleurs

### Couleurs Principales
- **Primary** : `#FF6B6B` (Rouge corail) - Boutons principaux, accents
- **Secondary** : `#4ECDC4` (Turquoise) - Éléments secondaires
- **Accent** : `#FFE66D` (Jaune doré) - Badges, étoiles, récompenses
- **Background** : `#FFFFFF` (Blanc) - Fond principal
- **Surface** : `#F7F9FC` (Gris très clair) - Cartes, surfaces élevées
- **Foreground** : `#2D3748` (Gris foncé) - Texte principal
- **Muted** : `#718096` (Gris moyen) - Texte secondaire

### Couleurs Fonctionnelles
- **Success** : `#48BB78` (Vert) - Validation, succès
- **Warning** : `#F6AD55` (Orange) - Avertissements
- **Error** : `#FC8181` (Rouge clair) - Erreurs
- **Info** : `#4299E1` (Bleu) - Informations

### Couleurs Thématiques (Arabe)
- **Gold** : `#D4AF37` - Éléments décoratifs arabes
- **Night Blue** : `#1A365D` - Fond des écrans narratifs
- **Star Gold** : `#FFD700` - Étoiles, ornements

## Typographie

### Police Principale
- **Système** : SF Pro (iOS), Roboto (Android)
- **Arabe** : Noto Naskh Arabic (pour les lettres arabes)

### Hiérarchie
- **H1** : 32px, Bold - Titres d'écran
- **H2** : 24px, Semibold - Sous-titres
- **H3** : 20px, Semibold - Sections
- **Body** : 16px, Regular - Texte courant
- **Caption** : 14px, Regular - Légendes
- **Button** : 18px, Semibold - Boutons
- **Arabic Letter** : 64px, Regular - Lettres arabes principales
- **Arabic Word** : 40px, Regular - Mots arabes

## Composants Clés

### 1. BadgeCard
- Forme : Cercle (80px de diamètre)
- Contenu : Lettre arabe + numéro du jour
- États : Verrouillé (gris), Débloqué (coloré), Actuel (pulsant)
- Animation : Scale + glow lors du déblocage

### 2. LetterCard
- Forme : Rectangle arrondi (16px radius)
- Contenu : Lettre arabe + son + transcription
- Interaction : Tap pour audio
- Animation : Bounce léger au tap

### 3. WordCard
- Forme : Rectangle arrondi (16px radius)
- Contenu : Mot arabe + image + traduction cachée
- Interaction : Tap pour audio, bouton pour révéler
- Animation : Flip pour révéler la traduction

### 4. ProgressBar
- Forme : Barre horizontale (8px hauteur)
- Couleur : Dégradé primary → accent
- Animation : Remplissage fluide avec spring

### 5. AudioButton
- Forme : Cercle (56px diamètre)
- Icône : 🔊 (haut-parleur)
- Couleur : Primary
- Animation : Pulse pendant la lecture
- Feedback : Haptique au tap

### 6. CelebrationModal
- Fond : Semi-transparent avec blur
- Contenu : Badge géant + message + confettis animés
- Bouton : "Continuer"
- Animation : Scale in + confettis

### 7. StoryCard
- Forme : Rectangle arrondi avec ombre
- Contenu : Illustration + texte narratif
- Style : Fond dégradé night blue → primary
- Décoration : Étoiles animées

## Animations et Transitions

### Transitions d'Écran
- **Type** : Slide from right (iOS standard)
- **Durée** : 300ms
- **Easing** : Ease-in-out

### Animations d'Interaction
- **Tap** : Scale 0.95 → 1.0 (80ms)
- **Déblocage de badge** : Scale 0 → 1.2 → 1.0 + rotation (500ms)
- **Confettis** : Particles falling (2000ms)
- **Étoiles** : Twinkle opacity 0.3 ↔ 1.0 (3000ms loop)

### Animations de Contenu
- **Lettre qui se dessine** : Path animation (2000ms)
- **Carte qui se retourne** : RotateY 0° → 180° (400ms)
- **Barre de progression** : Width 0% → X% avec spring (600ms)

## Interactions et Feedback

### Feedback Visuel
- **Tap** : Scale down + opacity
- **Succès** : Confettis + badge glow
- **Erreur** : Shake animation
- **Chargement** : Spinner avec couleur primary

### Feedback Haptique
- **Tap bouton** : Light impact
- **Succès** : Success notification
- **Erreur** : Error notification
- **Déblocage badge** : Medium impact

### Feedback Audio
- **Tap** : Son doux de clic
- **Succès** : Son de clochettes joyeuses
- **Erreur** : Son doux de "oups"
- **Déblocage** : Fanfare courte
- **Lettres/Mots** : Prononciation claire (voix enfantine)

## Accessibilité

### Taille des Éléments
- **Boutons principaux** : Minimum 60×60px
- **Boutons secondaires** : Minimum 44×44px
- **Zones de tap** : Minimum 44×44px (iOS HIG)

### Contraste
- **Texte sur fond clair** : Ratio 4.5:1 minimum
- **Texte sur fond foncé** : Ratio 4.5:1 minimum
- **Éléments interactifs** : Clairement identifiables

### Support
- **VoiceOver/TalkBack** : Labels sur tous les éléments interactifs
- **Taille de texte** : Support du scaling système
- **Mode sombre** : Palette adaptée (optionnel)

## Gestion des États

### Progression
- **Stockage** : AsyncStorage local
- **Structure** :
  ```typescript
  {
    currentDay: number,
    completedDays: number[],
    badges: { [day: number]: boolean },
    lastVisit: Date,
    totalTime: number
  }
  ```

### Audio
- **Préchargement** : Sons des 3 premiers jours au lancement
- **Streaming** : Jours suivants à la demande
- **Cache** : Persistance locale après premier téléchargement

### Performance
- **Lazy loading** : Écrans chargés à la demande
- **Image optimization** : Compression et formats adaptés
- **Animation** : 60 FPS minimum, utilisation de Reanimated

## Spécifications Techniques

### Navigation
- **Structure** : Tab navigation (Home, Dashboard, Profile)
- **Transitions** : Stack navigation pour les leçons
- **Deep linking** : Support des liens directs vers les jours

### Stockage
- **Local** : AsyncStorage pour la progression
- **Cache** : Fichiers audio et images
- **Backup** : Export/Import de la progression (optionnel)

### Audio
- **Format** : MP3 (compatibilité universelle)
- **Qualité** : 128 kbps (équilibre taille/qualité)
- **Mode** : Playback en mode silencieux iOS activé

### Performances
- **Taille app** : < 50 MB (sans audio)
- **Temps de chargement** : < 2 secondes
- **Fluidité** : 60 FPS constant
- **Mémoire** : < 100 MB en utilisation normale

## Écrans Détaillés

### Écran 1 : Home (Accueil)
```
┌─────────────────────────┐
│    [Logo + Étoiles]     │
│                         │
│   Horizon Bilingue      │
│  Apprends l'arabe en    │
│      30 jours !         │
│                         │
│      [Bibi 👶]          │
│                         │
│  ┌───────────────────┐  │
│  │ Commencer         │  │
│  │ l'aventure        │  │
│  └───────────────────┘  │
│                         │
│  [Guide pour parents]   │
└─────────────────────────┘
```

### Écran 2 : Dashboard (Tableau de Bord)
```
┌─────────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░ 14/29   │ ← Barre de progression
│                         │
│  ┌───┐ ┌───┐ ┌───┐     │
│  │ ب │ │ ت │ │ ث │ ... │ ← Badges (5 par ligne)
│  │ 1 │ │ 2 │ │ 3 │     │
│  └───┘ └───┘ └───┘     │
│                         │
│  ┌───┐ ┌───┐ ┌───┐     │
│  │ ن │ │ ي │ │🔒│ ... │
│  │ 4 │ │ 5 │ │ 6 │     │
│  └───┘ └───┘ └───┘     │
│                         │
│  ... (6 lignes total)   │
│                         │
│  ┌───────────────────┐  │
│  │ Continuer Jour 15 │  │ ← Bouton principal
│  └───────────────────┘  │
└─────────────────────────┘
```

### Écran 3 : Leçon (Exemple Jour 1)
```
┌─────────────────────────┐
│ Jour 1 - Lettre ب       │
│ ●●●○○○○ (3/7)          │ ← Progression de la leçon
├─────────────────────────┤
│                         │
│  [Illustration Bibi]    │
│                         │
│  Bibi est un petit      │
│  bébé qui apprend à     │
│  parler. Son premier    │
│  mot est "Baba"...      │
│                         │
│         [🔊]            │
│                         │
│  ┌───────────────────┐  │
│  │     Suivant       │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Écran 4 : Carte de Mot
```
┌─────────────────────────┐
│                         │
│                         │
│         بَبَ            │ ← Mot arabe (40px)
│                         │
│        (baba)           │ ← Transcription
│                         │
│         👶             │ ← Image
│                         │
│         [🔊]            │ ← Bouton audio
│                         │
│  ┌───────────────────┐  │
│  │    Afficher       │  │ ← Révéler traduction
│  └───────────────────┘  │
│                         │
│         ⭐             │ ← Étoile après écoute
└─────────────────────────┘
```

## Principes de Design

1. **Simplicité** : Interface épurée, une action principale par écran
2. **Clarté** : Textes courts, icônes intuitives, hiérarchie visuelle forte
3. **Feedback** : Réponse immédiate à chaque action
4. **Progression** : Visualisation constante de l'avancement
5. **Célébration** : Récompenses fréquentes et motivantes
6. **Autonomie** : L'enfant peut naviguer seul
7. **Sécurité** : Pas de liens externes, pas de publicité
8. **Joie** : Couleurs vives, animations ludiques, sons agréables

Cette conception garantit une expérience d'apprentissage optimale, intuitive et motivante pour les enfants de 7 ans, tout en respectant les standards iOS et les meilleures pratiques de design mobile.
