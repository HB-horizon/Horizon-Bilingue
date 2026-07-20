# TODO - Horizon Bilingue

## Configuration et Branding
- [x] Générer le logo de l'application (croissant de lune avec étoiles)
- [x] Configurer app.config.ts avec le nom et le logo
- [x] Mettre à jour la palette de couleurs dans theme.config.js
- [x] Configurer les icônes pour iOS et Android

## Structure de Données
- [x] Créer les types TypeScript pour les jours (Day, Lesson, Exercise)
- [x] Créer le fichier de données avec les 30 jours complets
- [x] Créer les types pour la progression utilisateur
- [x] Créer les utilitaires de gestion de la progression (AsyncStorage)

## Navigation et Structure
- [x] Configurer la navigation principale (Stack + Tabs)
- [x] Créer l'écran d'accueil (Home)
- [x] Créer l'écran tableau de bord (Dashboard)
- [x] Créer l'écran de leçon (Lesson)
- [x] Créer l'écran guide parents (ParentGuide)

## Composants Réutilisables
- [x] Créer le composant BadgeCard (badge de jour)
- [x] Créer le composant LetterCard (carte de lettre)
- [x] Créer le composant WordCard (carte de mot)
- [x] Créer le composant ProgressBar (barre de progression)
- [x] Créer le composant AudioButton (bouton audio)
- [x] Créer le composant CelebrationModal (modal de célébration)
- [x] Créer le composant StoryCard (carte d'histoire)

## Jour 1 - Lettre ب (ba)
- [x] Implémenter l'introduction narrative avec Bibi
- [x] Implémenter la présentation animée de la lettre
- [x] Implémenter les 3 sons de base (cartes interactives)
- [x] Implémenter les 4 formes de la lettre
- [x] Implémenter les 6 exercices de mots
- [x] Implémenter le jeu de reconnaissance
- [x] Implémenter la célébration et le badge

## Jour 2 - Lettre ت (ta)
- [x] Implémenter le mini-quiz de révision du jour 1
- [x] Implémenter l'introduction avec Tata
- [x] Implémenter la comparaison visuelle ب vs ت
- [x] Implémenter les 3 sons de ت
- [x] Implémenter les mots combinés ب + ت
- [x] Implémenter le défi du jour
- [x] Implémenter la célébration

## Jour 3 - Lettre ث (tha) + Prolongations
- [x] Implémenter le quiz de révision
- [x] Implémenter l'introduction des fruits
- [x] Implémenter la présentation de ث
- [x] Implémenter le concept de prolongation (visualisation)
- [x] Implémenter les 3 prolongations (Fat7a, Damma, Kasra)
- [x] Implémenter les exercices avec prolongation
- [x] Implémenter le jeu "son court ou long"
- [x] Implémenter la célébration

## Jour 4 - Lettre ن (nun)
- [x] Implémenter le grand quiz de révision (3 lettres)
- [x] Implémenter l'introduction avec les fourmis
- [x] Implémenter la présentation de ن
- [x] Implémenter les sons de ن (avec prolongations)
- [x] Implémenter les mots avec les 4 lettres
- [x] Implémenter le jeu de construction de syllabes
- [x] Implémenter le défi du champion (5 mots)
- [x] Implémenter la grande célébration + badge doré

## Jours 5 à 29 - Structure Standard
- [x] Créer le template de leçon standard
- [x] Implémenter le jour 5 - Lettre ي (ya)
- [x] Implémenter le jour 6 - Lettre م (mim)
- [x] Implémenter le jour 7 - Lettre ش (shin)
- [x] Implémenter le jour 8 - Lettre ج (jim)
- [x] Implémenter le jour 9 - Lettre ح (ha)
- [x] Implémenter le jour 10 - Lettre خ (kha) + jalon spécial
- [x] Implémenter le jour 11 - Lettre س (sin)
- [x] Implémenter le jour 12 - Lettre ص (sad)
- [x] Implémenter le jour 13 - Lettre ض (dad)
- [x] Implémenter le jour 14 - Lettre ط (ta)
- [x] Implémenter le jour 15 - Lettre ظ (za) + jalon mi-parcours
- [x] Implémenter le jour 16 - Lettre ع (ayn)
- [x] Implémenter le jour 17 - Lettre غ (ghayn)
- [x] Implémenter le jour 18 - Lettre ف (fa)
- [x] Implémenter le jour 19 - Lettre ق (qaf)
- [x] Implémenter le jour 20 - Lettre ك (kaf) + jalon spécial
- [x] Implémenter le jour 21 - Lettre ل (lam)
- [x] Implémenter le jour 22 - Lettre ه (ha)
- [x] Implémenter le jour 23 - Lettre ر (ra)
- [x] Implémenter le jour 24 - Lettre و (waw)
- [x] Implémenter le jour 25 - Lettre ز (zay) + jalon spécial
- [x] Implémenter le jour 26 - Lettre د (dal)
- [x] Implémenter le jour 27 - Lettre ذ (dhal)
- [x] Implémenter le jour 28 - Lettre ء (hamza)
- [x] Implémenter le jour 29 - Lettre ة (ta marbuta) + célébration spéciale

## Jour 30 - Sourate Al-Fatiha
- [x] Implémenter la révision finale des 29 lettres
- [x] Implémenter la présentation de la Fatiha complète
- [x] Implémenter la lecture guidée verset par verset
- [x] Implémenter la lecture autonome
- [x] Implémenter la traduction et explication
- [x] Implémenter la grande célébration finale
- [x] Implémenter le diplôme virtuel

## Système de Progression
- [x] Implémenter le système de sauvegarde (AsyncStorage)
- [x] Implémenter le système de badges
- [x] Implémenter la barre de progression globale
- [x] Implémenter le déblocage progressif des jours
- [x] Implémenter les statistiques (temps passé, jours complétés)
- [x] Implémenter l'export/import de la progression

## Fonctionnalités Audio
- [x] Configurer expo-av pour iOS silent mode
- [x] Créer le système de gestion audio (AudioManager)
- [x] Remplacer les fichiers WAF (vides) par expo-speech (lettres + mots) et audio-synthesizer (feedback)
- [ ] Remplacer expo-av par expo-speech + Web Audio API (fait partiellement, supprimer expo-av si plus utilisé)
- [x] Implémenter les sons de feedback via Web Audio API (audio-synthesizer)

## Interactions et Animations
- [ ] Implémenter les animations de transition d'écran
- [ ] Implémenter les animations de tap (scale)
- [x] Implémenter l'animation de déblocage de badge (spring scale dans BadgeCard)
- [x] Implémenter l'animation de confettis (émojis dans célébration)
- [ ] Implémenter l'animation des étoiles scintillantes
- [ ] Implémenter l'animation de dessin de lettre
- [x] Implémenter l'animation de retournement de carte (memory + vocabulaire)
- [x] Implémenter le feedback haptique (expo-haptics — tab bar seulement)

## Mini-Jeux
- [ ] Créer le jeu de reconnaissance de lettre (letter-recognition)
- [x] Créer le jeu d'association son-lettre (sound-matching)
- [x] Créer le jeu de mémoire (paires)
- [ ] Créer le jeu "son court ou long" (short-long-sound)
- [ ] Créer le jeu de construction de syllabes (glisser-déposer)

## Écran Guide Parents
- [x] Créer l'interface du guide parents
- [x] Implémenter la présentation de la méthode
- [x] Implémenter les conseils pédagogiques
- [x] Implémenter le suivi de progression
- [x] Implémenter les statistiques détaillées
- [ ] Implémenter les paramètres (audio, vitesse, difficulté)

## Accessibilité
- [ ] Ajouter les labels VoiceOver/TalkBack
- [ ] Tester le support du scaling de texte
- [ ] Vérifier les ratios de contraste
- [ ] Vérifier les tailles minimales de tap (44×44px)

## Tests et Optimisation
- [ ] Tester sur iOS (iPhone)
- [ ] Tester sur Android
- [ ] Tester sur différentes tailles d'écran
- [ ] Optimiser les performances (60 FPS)
- [ ] Optimiser la taille des images
- [ ] Optimiser la taille de l'application
- [ ] Tester le mode hors-ligne

## Documentation
- [x] Créer la notice d'utilisation pour enfants
- [x] Créer la notice d'utilisation pour parents
- [x] Créer le guide de démarrage rapide
- [x] Documenter les fonctionnalités avancées

## Livraison
- [ ] Créer le checkpoint final
- [ ] Préparer les captures d'écran
- [ ] Préparer la vidéo de démonstration
- [ ] Préparer le fichier README.md

## Améliorations demandées

### Design
- [x] Réduire la taille du logo de fond sur l'écran d'accueil

### Fonctionnalités Audio
- [x] Remplacer les fichiers WAV vides par expo-speech (lettres) + Web Audio API (feedbacks)
- [x] Intégrer expo-speech dans les composants de leçon
- [x] AudioManager simplifié : plus de dépendance aux fichiers WAV

### Mini-jeux interactifs
- [ ] Créer le jeu "Glisser-Déposer" (associer lettre et son)
- [x] Créer le jeu "Memory" (paires de lettres)
- [x] Créer le jeu "Quiz" (reconnaissance de lettres)
- [x] Créer le jeu "Association Son-Lettre" (sound-matching)
- [ ] Intégrer les mini-jeux dans le flux des leçons
- [x] Ajouter un écran dédié aux mini-jeux

### Mode Révision
- [x] Créer l'écran de révision avec flashcards
- [x] Implémenter le système de flashcards (recto/verso)
- [x] Ajouter la navigation entre les flashcards
- [x] Intégrer les sons dans les flashcards (via AudioManager)
- [x] Ajouter un bouton "Mode Révision" dans le tableau de bord

## Système de Récompenses
- [x] Créer le type TypeScript pour les récompenses et badges
- [x] Implémenter la logique de calcul des récompenses (scores, temps)
- [x] Créer les composants visuels pour les badges spéciaux
- [x] Ajouter l'écran "Mes Récompenses" dans le dashboard
- [x] Intégrer les récompenses dans les mini-jeux (Memory et Quiz)
- [x] Ajouter les animations de déblocage de badges
- [x] Tester le système de récompenses complet

## Fichiers Audio (remplacés par synthèse vocale)
- [x] Utiliser expo-speech pour les lettres (construction lettre+harakat en Unicode)
- [x] Utiliser expo-speech pour les mots (déjà fait)
- [x] Utiliser Web Audio API (audio-synthesizer) pour les feedbacks
- [x] Nettoyer AudioManager : suppression des dépendances expo-av et fichiers WAV
- [ ] Tester la lecture audio sur tous les écrans

## Bug Fixes
- [x] Corriger l'import manquant (View, Text, TouchableOpacity) dans app/lesson/[day].tsx

## Règles de Lecture (Tajwid)
- [ ] Intégrer le texte d'introduction Bismillah
- [x] Intégrer Madd Attabi3i dans la leçon 3 (tha)
- [x] Intégrer Madd El Badal dans la leçon 10 (kha)
- [x] Intégrer Madd El 3iwad dans la leçon 15 (za)
- [x] Intégrer Madd As-silla soghra dans la leçon 20 (kaf)
- [x] Intégrer Madd At-tamkin dans la leçon 25 (zay)
- [x] Intégrer Madd El Alifaat dans la leçon 28 (hamza)
- [x] Intégrer la règle des 7 Alifs dans la leçon 29 (ta marbuta)
