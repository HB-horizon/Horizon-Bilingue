import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useProgress } from "@/hooks/use-progress";
import { useState } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { HamburgerButton } from "@/components/drawer/hamburger-button";
import { useDrawer } from "@/components/drawer/drawer-provider";

type Tab = "parents" | "apprenants";

export default function ParentGuideScreen() {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { progress, getProgressPercentage } = useProgress();
  const [activeTab, setActiveTab] = useState<Tab>("parents");

  const progressPercentage = progress ? getProgressPercentage() : 0;
  const totalTime = progress ? Math.floor(progress.totalTime / 60) : 0;
  const lettersLearned = progress?.completedDays.length || 0;

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View style={{ backgroundColor: "#0F172A" }} className="pt-4 pb-6 px-5">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <HamburgerButton onPress={openDrawer} />
            <TouchableOpacity onPress={() => router.back()} className="active:opacity-70">
              <Text style={{ color: "#94A3B8" }} className="text-sm">
                ← Retour
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push('/')} className="active:opacity-70 p-2">
            <Text className="text-xl">🏠</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-3xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          Guide
        </Text>
        <Text className="text-sm text-center" style={{ color: "#94A3B8" }}>
          Tout ce qu&apos;il faut savoir pour bien démarrer
        </Text>

        {/* Tabs */}
        <View className="flex-row mt-5 bg-surface/30 rounded-2xl p-1">
          {(["parents", "apprenants"] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-xl"
              style={{
                backgroundColor: activeTab === tab ? "#FF6B6B" : "transparent",
              }}
            >
              <Text
                className="text-sm font-bold text-center"
                style={{ color: activeTab === tab ? "#fff" : "#94A3B8" }}
              >
                {tab === "parents" ? "👨‍👩‍👧 Parents" : "🎓 Apprenants"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {activeTab === "parents" ? <ParentsContent lettersLearned={lettersLearned} progressPercentage={progressPercentage} totalTime={totalTime} progress={progress} /> : <LearnersContent lettersLearned={lettersLearned} progressPercentage={progressPercentage} />}
      </ScrollView>
    </ScreenContainer>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View className="flex-1 items-center py-4 px-2" style={{ backgroundColor: `${color}15`, borderRadius: 16 }}>
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className="text-2xl font-extrabold" style={{ color }}>{value}</Text>
      <Text className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{label}</Text>
    </View>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mx-5 mb-5">
      <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#334155" }}>
        <View className="px-5 py-4 flex-row items-center" style={{ borderBottomWidth: 1, borderBottomColor: "#334155" }}>
          <Text className="text-lg mr-2">{icon}</Text>
          <Text className="text-base font-bold" style={{ color: "#F1F5F9" }}>{title}</Text>
        </View>
        <View className="p-5">{children}</View>
      </View>
    </Animated.View>
  );
}

function TipItem({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <View className="flex-row mb-4 last:mb-0">
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: "#FF6B6B20" }}>
        <Text className="text-lg">{emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold mb-0.5" style={{ color: "#F1F5F9" }}>{title}</Text>
        <Text className="text-xs leading-5" style={{ color: "#94A3B8" }}>{desc}</Text>
      </View>
    </View>
  );
}

function MilestoneItem({ day, label, done }: { day: number; label: string; done: boolean }) {
  return (
    <View className="flex-row items-center mb-3 last:mb-0">
      <View
        className="w-8 h-8 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: done ? "#10B981" : "#334155" }}
      >
        {done ? (
          <Text className="text-white text-xs font-bold">✓</Text>
        ) : (
          <Text style={{ color: "#64748B" }} className="text-xs font-bold">{day}</Text>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-sm" style={{ color: done ? "#6EE7B7" : "#CBD5E1" }}>
          Jour {day} — {label}
        </Text>
      </View>
    </View>
  );
}

function ParentsContent({ lettersLearned, progressPercentage, totalTime, progress }: { lettersLearned: number; progressPercentage: number; totalTime: number; progress: any }) {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      {/* Stats */}
      <View className="px-5 mb-5 mt-4">
        <View className="flex-row gap-2">
          <StatCard label="Lettres" value={`${lettersLearned}/29`} icon="📖" color="#FF6B6B" />
          <StatCard label="Progression" value={`${progressPercentage}%`} icon="📊" color="#10B981" />
          <StatCard label="Temps" value={`${totalTime}m`} icon="⏱️" color="#F59E0B" />
        </View>
      </View>

      {/* Progress bar */}
      {lettersLearned > 0 && (
        <View className="mx-5 mb-5">
          <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#334155" }}>
            <View className="h-full rounded-full" style={{ width: `${progressPercentage}%`, backgroundColor: "#FF6B6B" }} />
          </View>
        </View>
      )}

      {/* Méthode */}
      <SectionCard title="La Méthode Horizon Bilingue" icon="🎯">
        <Text className="text-xs leading-6 mb-4" style={{ color: "#CBD5E1" }}>
          Une approche pédagogique progressive et ludique, conçue pour les enfants dès 7 ans. Chaque jour, votre enfant découvre une nouvelle lettre à travers des histoires, des sons et des exercices interactifs.
        </Text>
        <View className="rounded-xl p-3" style={{ backgroundColor: "#FF6B6B15" }}>
          <Text className="text-xs font-bold mb-2" style={{ color: "#FCA5A5" }}>Points clés</Text>
          {[
            "Progression douce — une lettre par jour",
            "Storytelling avec le personnage Houda",
            "Badges et récompenses pour motiver",
            "Répétition espacée pour mémoriser",
            "Audio de prononciation par voix arabe",
          ].map((item, i) => (
            <Text key={i} className="text-xs mb-1 last:mb-0" style={{ color: "#94A3B8" }}>• {item}</Text>
          ))}
        </View>
      </SectionCard>

      {/* Conseils */}
      <SectionCard title="Conseils pour accompagner" icon="💡">
        <TipItem emoji="⏰" title="Régularité" desc="15-20 minutes par jour suffisent. Mieux vaut court et quotidien que long et hebdomadaire." />
        <TipItem emoji="👂" title="Écoute active" desc="Encouragez à écouter plusieurs fois chaque son et à répéter à haute voix." />
        <TipItem emoji="✏️" title="Écriture" desc="Proposez d'écrire les lettres sur papier pour renforcer la mémoire kinesthésique." />
        <TipItem emoji="🎉" title="Célébration" desc="Félicitez à chaque badge débloqué. La motivation est la clé !" />
        <TipItem emoji="🔄" title="Révision" desc="Revoir les jours précédents renforce les acquis. N'hésitez pas !" />
      </SectionCard>

      {/* Jalons */}
      <SectionCard title="Jalons du parcours" icon="🗺️">
        <MilestoneItem day={4} label="Badge spécial « Champion »" done={(progress?.completedDays.length || 0) >= 4} />
        <MilestoneItem day={10} label="1/3 du chemin" done={(progress?.completedDays.length || 0) >= 10} />
        <MilestoneItem day={15} label="Mi-parcours !" done={(progress?.completedDays.length || 0) >= 15} />
        <MilestoneItem day={20} label="Plus que 9 lettres" done={(progress?.completedDays.length || 0) >= 20} />
        <MilestoneItem day={29} label="Dernière lettre" done={(progress?.completedDays.length || 0) >= 29} />
        <MilestoneItem day={30} label="Lecture de Al-Fatiha" done={(progress?.completedDays.length || 0) >= 30} />
      </SectionCard>

      {/* Aide */}
      <SectionCard title="Besoin d'aide ?" icon="📧">
        <Text className="text-xs leading-5 mb-3" style={{ color: "#94A3B8" }}>
          Questions sur la méthode, difficultés techniques ou suggestions d&apos;amélioration ?
        </Text>
        <TouchableOpacity className="py-3 rounded-xl active:opacity-80" style={{ backgroundColor: "#FF6B6B" }}>
          <Text className="text-white text-sm font-bold text-center">Nous contacter</Text>
        </TouchableOpacity>
      </SectionCard>
    </Animated.View>
  );
}

function LearnersContent({ lettersLearned, progressPercentage }: { lettersLearned: number; progressPercentage: number }) {
  return (
    <Animated.View entering={FadeIn.duration(300)}>
      {/* Stats */}
      <View className="px-5 mb-5 mt-4">
        <View className="flex-row gap-2">
          <StatCard label="Apprises" value={`${lettersLearned}`} icon="✨" color="#8B5CF6" />
          <StatCard label="Restantes" value={`${29 - lettersLearned}`} icon="📝" color="#F59E0B" />
          <StatCard label="Progression" value={`${progressPercentage}%`} icon="🚀" color="#10B981" />
        </View>
      </View>

      {/* Comment ça marche */}
      <SectionCard title="Comment ça marche ?" icon="🚀">
        <TipItem emoji="1️⃣" title="Écoute la lettre" desc="Appuie sur le bouton 🔊 pour entendre la lettre et ses sons." />
        <TipItem emoji="2️⃣" title="Pratique les mots" desc="Écoute les mots et répète-les pour bien les mémoriser." />
        <TipItem emoji="3️⃣" title="Fais les exercices" desc="Teste-toi avec les exercices pour valider ta leçon." />
        <TipItem emoji="4️⃣" title="Débloque un badge" desc="Chaque lettre terminée te donne un nouveau badge !" />
      </SectionCard>

      {/* Ce que tu vas apprendre */}
      <SectionCard title="Ce que tu vas apprendre" icon="📚">
        <Text className="text-xs leading-6 mb-3" style={{ color: "#CBD5E1" }}>
          En 30 jours, tu vas maîtriser l&apos;alphabet arabe complet :
        </Text>
        {[
          { label: "Les 29 lettres de base", icon: "🔤" },
          { label: "Les 3 sons (fatha, damma, kasra)", icon: "🔊" },
          { label: "Les règles de lecture (Alif, Hamza, Prolongation)", icon: "📖" },
          { label: "Des mots du vocabulaire coranique", icon: "💎" },
          { label: "La lecture de Sourate Al-Fatiha", icon: "🌟" },
        ].map((item, i) => (
          <View key={i} className="flex-row items-center mb-2 last:mb-0">
            <Text className="text-sm mr-2">{item.icon}</Text>
            <Text className="text-xs" style={{ color: "#94A3B8" }}>{item.label}</Text>
          </View>
        ))}
      </SectionCard>

      {/* Astuces */}
      <SectionCard title="Astuces pour bien apprendre" icon="🧠">
        <TipItem emoji="🎯" title="Écoute et répète" desc="Clique sur le haut-parleur autant de fois que nécessaire." />
        <TipItem emoji="✍️" title="Écris la lettre" desc="Trace la lettre sur une feuille pour mieux la retenir." />
        <TipItem emoji="🏆" title="Chaque jour compte" desc="Essaie de ne pas manquer un jour pour garder ta série !" />
        <TipItem emoji="🎮" title="Joue et révise" desc="Utilise les mini-jeux et le mode révision pour t'amuser en apprenant." />
      </SectionCard>

      {/* Vocabulaire coranique */}
      <SectionCard title="Vocabulaire du Coran" icon="📖">
        <Text className="text-xs leading-6 mb-3" style={{ color: "#CBD5E1" }}>
          Tu peux aussi découvrir les mots les plus importants du Coran dans la section Vocabulaire. Chaque mot a sa prononciation et sa signification.
        </Text>
        <View className="rounded-xl p-3" style={{ backgroundColor: "#8B5CF615" }}>
          <Text className="text-xs leading-5" style={{ color: "#A78BFA" }}>
            210 mots classés par catégorie : Noms Divins, Verbes, Noms Courants, Expressions...
          </Text>
        </View>
      </SectionCard>
    </Animated.View>
  );
}
