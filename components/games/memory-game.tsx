import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Animated, { 
  FadeIn, 
  FlipInEasyY,
  FlipOutEasyY,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { playLetterSound } from '@/lib/audio-manager';

type Card = {
  id: number;
  letter: string;
  latinName: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type MemoryGameProps = {
  letters: Array<{ letter: string; latinName: string }>;
  onComplete: () => void;
};

/**
 * Jeu Memory - Paires de lettres arabes
 * 
 * Règles :
 * - Retourner 2 cartes à la fois
 * - Si elles correspondent, elles restent retournées
 * - Sinon, elles se retournent après 1 seconde
 * - Gagner en trouvant toutes les paires
 */
export function MemoryGame({ letters, onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  
  // Initialiser le jeu
  useEffect(() => {
    initializeGame();
  }, [letters]);
  
  const initializeGame = () => {
    // Créer des paires de cartes
    const pairs = letters.slice(0, 6); // 6 paires = 12 cartes
    const cardPairs: Card[] = [];
    
    pairs.forEach((letter, index) => {
      // Première carte de la paire
      cardPairs.push({
        id: index * 2,
        letter: letter.letter,
        latinName: letter.latinName,
        isFlipped: false,
        isMatched: false,
      });
      
      // Deuxième carte de la paire
      cardPairs.push({
        id: index * 2 + 1,
        letter: letter.letter,
        latinName: letter.latinName,
        isFlipped: false,
        isMatched: false,
      });
    });
    
    // Mélanger les cartes
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
  };
  
  const handleCardPress = async (cardId: number) => {
    if (isChecking) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Retourner la carte
    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // Jouer le son de la lettre
    await playLetterSound(card.letter, 'fatha');
    
    // Si 2 cartes sont retournées, vérifier la correspondance
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard && secondCard && firstCard.letter === secondCard.letter) {
        // Paire trouvée !
        setTimeout(() => {
          const matchedCards = cards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          setIsChecking(false);
          
          // Vérifier si le jeu est terminé
          if (matchedPairs + 1 === letters.slice(0, 6).length) {
            setTimeout(() => onComplete(), 500);
          }
        }, 800);
      } else {
        // Pas de correspondance, retourner les cartes
        setTimeout(() => {
          const resetCards = cards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          );
          setCards(resetCards);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  };
  
  const screenWidth = Dimensions.get('window').width;
  const cardSize = (screenWidth - 80) / 4; // 4 colonnes avec marges
  
  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      className="flex-1 p-6"
    >
      {/* En-tête */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          🎮 Jeu Memory
        </Text>
        <Text className="text-base text-center text-muted mb-4">
          Trouve les paires de lettres identiques
        </Text>
        
        {/* Statistiques */}
        <View className="flex-row justify-center gap-6">
          <View className="bg-surface px-4 py-2 rounded-xl">
            <Text className="text-sm text-muted">Coups</Text>
            <Text className="text-xl font-bold text-primary text-center">
              {moves}
            </Text>
          </View>
          <View className="bg-surface px-4 py-2 rounded-xl">
            <Text className="text-sm text-muted">Paires</Text>
            <Text className="text-xl font-bold text-success text-center">
              {matchedPairs}/{letters.slice(0, 6).length}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Grille de cartes */}
      <View className="flex-row flex-wrap justify-center gap-2">
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => handleCardPress(card.id)}
            disabled={card.isMatched || card.isFlipped || isChecking}
            style={{
              width: cardSize,
              height: cardSize,
            }}
          >
            <View
              className={`w-full h-full rounded-xl items-center justify-center shadow-md ${
                card.isMatched
                  ? 'bg-success/20 border-2 border-success'
                  : card.isFlipped
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-surface border-2 border-border'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <Text className="text-4xl">{card.letter}</Text>
              ) : (
                <Text className="text-3xl">❓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Bouton recommencer */}
      <View className="mt-auto pt-6">
        <TouchableOpacity
          onPress={initializeGame}
          className="bg-muted rounded-full py-3 px-6 active:opacity-80"
        >
          <Text className="text-white text-base font-bold text-center">
            🔄 Recommencer
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
