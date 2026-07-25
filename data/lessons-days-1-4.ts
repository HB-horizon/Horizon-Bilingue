import { DayLesson } from '../types/lesson';

/**
 * Données des 4 premiers jours avec améliorations pédagogiques
 * pour les enfants de 7 ans
 */

export const day1Lesson: DayLesson = {
  dayNumber: 1,
  letter: 'ب',
  latinName: 'ba',
  exampleWord: 'بابا',
  exampleLatin: 'Baba',
  exampleImage: '👶',
  
  // Histoire narrative
  storyTitle: 'Bibi le bébé',
  storyContent: 'Bibi est un petit bébé qui apprend à parler. Son premier mot est "Baba" (papa). Aide Bibi à apprendre la lettre B en arabe !',
  storyCharacter: '👶',
  mnemonicTip: 'La lettre ب a un point en dessous, comme un petit bébé qui apprend !',
  
  forms: {
    isolated: 'ب',
    beginning: 'بـ',
    middle: 'ـبـ',
    end: 'ـب',
  },
  
  harakatExamples: [
    { arabic: 'بَ', trans: 'ba' },
    { arabic: 'بُ', trans: 'bou' },
    { arabic: 'بِ', trans: 'bi' },
  ],
  
  readingRules: [
    {
      name: 'Le Soukoun',
      description: 'L\'absence de voyelle — une lettre sans voyelle se prononce en bloquant le son',
      example: 'بْ',
      explanation: 'Quand une lettre a un petit cercle au-dessus (ْ), on ne met pas de voyelle après. On bloque le son : "b" (et non "ba", "bou" ou "bi"). Comme dans بْت : "bt" et non "bata".',
    },
  ],
  
  exerciseWords: [
    { arabic: 'بَبَ', latin: 'baba', image: '👨' },
    { arabic: 'بِبِ', latin: 'bibi', image: '👶' },
    { arabic: 'بُبُ', latin: 'boubu', image: '🎈' },
    { arabic: 'بَبُ', latin: 'babou', image: '🐻' },
    { arabic: 'بِبُ', latin: 'bibou', image: '🎪' },
    { arabic: 'بَبِ', latin: 'babi', image: '🌟' },
  ],
};

export const day2Lesson: DayLesson = {
  dayNumber: 2,
  letter: 'ت',
  latinName: 'ta',
  exampleWord: 'تمر',
  exampleLatin: 'Tamr',
  exampleImage: '📅',
  
  // Histoire narrative
  storyTitle: 'Tata arrive',
  storyContent: 'Aujourd\'hui, Tata vient rendre visite à Bibi. Elle apporte des "tamr" (dattes). Apprends la lettre de Tata !',
  storyCharacter: '👩',
  mnemonicTip: 'ت a deux points au-dessus comme deux dattes ! 📅📅',
  
  forms: {
    isolated: 'ت',
    beginning: 'تـ',
    middle: 'ـتـ',
    end: 'ـت',
  },
  
  harakatExamples: [
    { arabic: 'تَ', trans: 'ta' },
    { arabic: 'تُ', trans: 'tou' },
    { arabic: 'تِ', trans: 'ti' },
  ],
  
  readingRules: [
    {
      name: 'Le Tanwin',
      description: 'Le double-voyelle — quand on ajoute un "n" à la fin d\'un mot',
      example: 'تَتًا',
      explanation: 'Le tanwin, c\'est quand on double la voyelle à la fin d\'un mot : ً (tanwin fat7a → "an"), ٌ (tanwin damma → "oun"), ٍ (tanwin kasra → "in"). Exemple : تَتًا se lit "tatan". C\'est comme ajouter un petit "n" à la fin !',
    },
  ],
  
  exerciseWords: [
    { arabic: 'تَبَ', latin: 'taba', image: '📖' },
    { arabic: 'بَتَ', latin: 'bata', image: '🦆' },
    { arabic: 'تِبِ', latin: 'tibi', image: '🎭' },
    { arabic: 'تَتَ', latin: 'tata', image: '👩' },
    { arabic: 'بِتِ', latin: 'biti', image: '🏠' },
    { arabic: 'تِتِ', latin: 'titi', image: '🎵' },
  ],
};

export const day3Lesson: DayLesson = {
  dayNumber: 3,
  letter: 'ث',
  latinName: 'tha',
  exampleWord: 'ثمر',
  exampleLatin: 'Thamr',
  exampleImage: '🍇',
  
  // Histoire narrative
  storyTitle: 'Le secret des sons longs',
  storyContent: 'Bibi découvre les fruits ! Il adore les "thamr" (fruits). Mais attention, cette lettre a un secret magique : elle peut chanter longtemps !',
  storyCharacter: '🍇',
  mnemonicTip: 'ث a trois points comme trois fruits ! 🍇🍇🍇',
  
  forms: {
    isolated: 'ث',
    beginning: 'ثـ',
    middle: 'ـثـ',
    end: 'ـث',
  },
  
  harakatExamples: [
    { arabic: 'ثَ', trans: 'tha' },
    { arabic: 'ثُ', trans: 'thou' },
    { arabic: 'ثِ', trans: 'thi' },
  ],
  
  hasElongation: true,
  elongationExercises: [
    { arabic: 'ثَا', trans: 'thaa', type: 'Fat7a' },
    { arabic: 'ثُو', trans: 'thou', type: 'Damma' },
    { arabic: 'ثِي', trans: 'thii', type: 'Kasra' },
    { arabic: 'ثَاثِي', trans: 'thaathii', type: 'Combiné' },
    { arabic: 'ثُوثِيَا', trans: 'thoothiaa', type: 'Combiné' },
    { arabic: 'ثِيثَا', trans: 'thiithaa', type: 'Combiné' },
  ],
  
  readingRules: [
    {
      name: 'Madd Attabi3i',
      description: 'La prolongation naturelle — on allonge le son pendant 2 temps',
      example: 'ثَا',
      explanation: 'Quand une lettre est suivie d\'un alif (ا), d\'un waw (و) ou d\'un ya (ي) silencieux, on prolonge le son naturellement. Comme dans ثَا (thaa) : le son "a" dure 2 temps.',
    },
  ],
  
  exerciseWords: [
    { arabic: 'ثَبَ', latin: 'thaba', image: '📖' },
    { arabic: 'بَثَ', latin: 'batha', image: '🐝' },
    { arabic: 'ثِبِ', latin: 'thibi', image: '🎭' },
    { arabic: 'تَثَ', latin: 'tatha', image: '🔔' },
    { arabic: 'ثَتَ', latin: 'thata', image: '🍌' },
    { arabic: 'ثِثِ', latin: 'thithi', image: '⭐' },
  ],
};

export const day4Lesson: DayLesson = {
  dayNumber: 4,
  letter: 'ن',
  latinName: 'nun',
  exampleWord: 'نمل',
  exampleLatin: 'Naml',
  exampleImage: '🐜',
  
  // Histoire narrative
  storyTitle: 'Champion des 4 jours',
  storyContent: 'Bibi voit des fourmis ("naml") dans le jardin ! Apprends la lettre ن pour parler des fourmis. C\'est ta 4ème lettre, tu deviens un champion !',
  storyCharacter: '🐜',
  mnemonicTip: 'ن ressemble à un petit nid de fourmis avec un point au-dessus !',
  isSpecialDay: true,
  
  forms: {
    isolated: 'ن',
    beginning: 'نـ',
    middle: 'ـنـ',
    end: 'ـن',
  },
  
  harakatExamples: [
    { arabic: 'نَ', trans: 'na' },
    { arabic: 'نُ', trans: 'nou' },
    { arabic: 'نِ', trans: 'ni' },
  ],
  
  readingRules: [
    {
      name: 'La Chadda',
      description: 'Le redoublement — quand une lettre est doublée, on insiste deux fois plus !',
      example: 'نَّ',
      explanation: 'La chadda (ّ) est un petit "w" au-dessus d\'une lettre. Elle dit qu\'on doit prononcer la lettre deux fois : une fois sans voyelle, une fois avec la voyelle. نَّ se lit "n-na" : le premier "n" est coupé, le deuxième "na" est prononcé. C\'est comme si la lettre sautillait !',
    },
  ],
  
  hasElongation: true,
  elongationExercises: [
    { arabic: 'نَا', trans: 'naa', type: 'Fat7a' },
    { arabic: 'نُو', trans: 'nou', type: 'Damma' },
    { arabic: 'نِي', trans: 'nii', type: 'Kasra' },
    { arabic: 'نَانِي', trans: 'naanii', type: 'Combiné' },
    { arabic: 'نُونِيَا', trans: 'nouniaa', type: 'Combiné' },
    { arabic: 'نِينَا', trans: 'niinaa', type: 'Combiné' },
  ],
  
  exerciseWords: [
    { arabic: 'نَبْتَ', latin: 'nabta', image: '🌳' },
    { arabic: 'بِنْتٌ', latin: 'bintun', image: '👧' },
    { arabic: 'ثَبِتَ', latin: 'thabita', image: '🪨' },
    { arabic: 'تَنْبِيهٌ', latin: 'tanbih', image: '🔔' },
    { arabic: 'نَتْوَ', latin: 'natwa', image: '📍' },
    { arabic: 'بَنَاءٌ', latin: 'bana', image: '🏗️' },
  ],
};

export const firstFourDaysLessons: DayLesson[] = [
  day1Lesson,
  day2Lesson,
  day3Lesson,
  day4Lesson,
];
