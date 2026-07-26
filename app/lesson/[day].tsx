import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { StoryCard } from '@/components/lesson/story-card';
import { LetterPresentation } from '@/components/lesson/letter-presentation';
import { SoundsSection } from '@/components/lesson/sounds-section';
import { ReadingRulesSection } from '@/components/lesson/reading-rules-section';
import { FormsSection } from '@/components/lesson/forms-section';
import { WritingSection } from '@/components/lesson/writing-section';
import { ExerciseSection } from '@/components/lesson/exercise-section';
import { CelebrationScreen } from '@/components/lesson/celebration-screen';
import { useProgress } from '@/hooks/use-progress';
import { getLessonByDay } from '@/data/all-lessons';
import { useState, useEffect, useRef } from 'react';
import { LessonStep } from '@/types/lesson';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { addItemsToSRS, createSRSItem } from '@/lib/srs-manager';
import { HamburgerButton } from '@/components/drawer/hamburger-button';
import { useDrawer } from '@/components/drawer/drawer-provider';

/**
 * Écran de leçon - Orchestrateur de toutes les sections
 * 
 * Gère le flux de la leçon :
 * 1. Histoire (jours 1-4 uniquement)
 * 2. Présentation de la lettre
 * 3. Sons (voyelles)
 * 4. Règles de lecture (Alif, Hamza, Prolongation)
 * 5. Formes
 * 6. Exercices
 * 7. Célébration
 */
export default function LessonScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { completeDay, startDay, isDayUnlocked, progress, loading: progressLoading } = useProgress();
  
  const dayNumber = parseInt(day || '1', 10);
  const lesson = getLessonByDay(dayNumber);
  
  const [currentStep, setCurrentStep] = useState<LessonStep>('story');
  const [loading, setLoading] = useState(true);
  const accessCheckedRef = useRef(false);
  
  // Vérifier l'accès et démarrer la leçon - une seule fois quand progress est chargé
  useEffect(() => {
    // Ne vérifier qu'une seule fois
    if (accessCheckedRef.current) return;
    
    // Attendre que la progression soit chargée
    if (progressLoading || !progress) {
      return;
    }
    
    accessCheckedRef.current = true;
    
    const checkAccessAndStart = async () => {
      // Vérifier si le jour est débloqué
      const unlocked = isDayUnlocked(dayNumber);
      if (!unlocked) {
        console.log(`Jour ${dayNumber} non débloqué. Jours complétés:`, progress.completedDays);
        router.replace('/dashboard');
        return;
      }
      
      console.log(`Jour ${dayNumber} débloqué. Démarrage de la leçon...`);
      
      // Enregistrer le début de la leçon
      try {
        await startDay(dayNumber);
      } catch (err) {
        console.error('Erreur lors du démarrage du jour:', err);
      }
      
      // Déterminer l'étape de départ
      if (lesson?.storyTitle) {
        setCurrentStep('story');
      } else {
        setCurrentStep('letter-presentation');
      }
      
      setLoading(false);
    };
    
    checkAccessAndStart();
  }, [progressLoading, progress, dayNumber, lesson?.storyTitle, isDayUnlocked, startDay, router]);
  
  if (loading || !lesson) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Chargement...</Text>
      </ScreenContainer>
    );
  }
  
  const handleNext = () => {
    switch (currentStep) {
      case 'story':
        setCurrentStep('letter-presentation');
        break;
      case 'letter-presentation':
        setCurrentStep('sounds');
        break;
      case 'sounds':
        // Vérifier s'il y a des règles de lecture
        if (lesson?.readingRules && lesson.readingRules.length > 0) {
          setCurrentStep('reading-rules');
        } else {
          setCurrentStep('forms');
        }
        break;
      case 'reading-rules':
        setCurrentStep('forms');
        break;
      case 'forms':
        setCurrentStep('writing');
        break;
      case 'writing':
        setCurrentStep('exercises');
        break;
      case 'exercises':
        setCurrentStep('celebration');
        break;
      case 'celebration':
        handleFinish();
        break;
    }
  };
  
  const handleFinish = async () => {
    if (lesson) {
      const items = [
        createSRSItem('letter', lesson.letter, lesson.latinName),
        ...lesson.exerciseWords.map((w) => createSRSItem('word', w.arabic, w.latin)),
      ];
      await addItemsToSRS(items);
    }
    await completeDay(dayNumber);
    router.replace('/dashboard');
  };
  
  return (
    <ScreenContainer edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View className="bg-surface border-b border-border px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <HamburgerButton onPress={openDrawer} />
            <TouchableOpacity
              onPress={() => router.back()}
              className="active:opacity-70"
            >
              <Text className="text-primary text-sm font-bold">← Retour</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-foreground font-bold text-sm">
            Jour {dayNumber}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/')}
            className="active:opacity-70 p-2"
          >
            <Text className="text-xl">🏠</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 'story' && lesson.storyTitle && (
          <StoryCard
            title={lesson.storyTitle}
            content={lesson.storyContent || ''}
            character={lesson.storyCharacter || '😊'}
            onNext={handleNext}
          />
        )}

        {currentStep === 'letter-presentation' && (
          <LetterPresentation
            letter={lesson.letter}
            latinName={lesson.latinName}
            exampleWord={lesson.exampleWord}
            exampleLatin={lesson.exampleLatin}
            exampleImage={lesson.exampleImage}
            storyContent={lesson.storyContent}
            storyCharacter={lesson.storyCharacter}
            dayNumber={dayNumber}
            mnemonicTip={lesson.mnemonicTip}
            onNext={handleNext}
          />
        )}

        {currentStep === 'sounds' && (
          <SoundsSection
            sounds={lesson.harakatExamples}
            onNext={handleNext}
          />
        )}

        {currentStep === 'reading-rules' && lesson.readingRules && (
          <ReadingRulesSection
            rules={lesson.readingRules}
            onNext={handleNext}
          />
        )}

        {currentStep === 'forms' && (
          <FormsSection
            forms={lesson.forms}
            onNext={handleNext}
          />
        )}

        {currentStep === 'writing' && (
          <WritingSection
            letter={lesson.letter}
            latinName={lesson.latinName}
            forms={lesson.forms}
            onNext={handleNext}
          />
        )}

        {currentStep === 'exercises' && (
          <ExerciseSection
            words={lesson.exerciseWords}
            onNext={handleNext}
          />
        )}

        {currentStep === 'celebration' && (
          <CelebrationScreen
            dayNumber={dayNumber}
            letter={lesson.letter}
            onFinish={handleFinish}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
