import asyncio
import edge_tts
import os
import json
import hashlib

VOICE = "ar-SA-HamedNeural"
RATE = "-10%"
AUDIO_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")
MAPPING_FILE = os.path.join(AUDIO_DIR, "mapping.json")

# Load existing mapping
with open(MAPPING_FILE, "r", encoding="utf-8") as f:
    mapping = json.load(f)

def make_filename(text):
    h = hashlib.md5(text.encode("utf-8")).hexdigest()[:12]
    return f"{h}.mp3"

async def generate_one(text, out_path):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(out_path)

# All 210 vocabulary words
VOCAB_WORDS = [
    "اللَّهُ", "رَبّ", "الرَّحْمَن", "الرَّحِيم", "الْعَزِيز", "الْغَفُور", "الْحَكِيم", "الْعَلِيم", "الْخَبِير", "السَّمِيع",
    "الْبَصِير", "الْقَدِير", "الْحَلِيم", "الْحَمِيد", "الْكَرِيم", "اللَّطِيف", "الْوَكِيل", "الْقَوِي", "الْمَلِك", "الْقُدُّوس",
    "فِي", "مِن", "إِلَى", "عَلَى", "بِ", "لِ", "عَنْ", "مَعَ", "بَيْن", "قَبْل",
    "بَعْد", "فَوْق", "تَحْت", "أَمَام", "وَرَاء", "دُون", "حَتَّى", "عِنْد", "حَوْل", "كَ",
    "هُوَ", "هُمْ", "هِيَ", "أَنَا", "نَحْنُ", "أَنْتَ", "أَنْتُمْ", "هَذَا", "هَذِهِ", "ذَلِكَ",
    "أُولَئِكَ", "الَّذِي", "الَّتِي", "الَّذِينَ", "مَا", "مَنْ", "مَتَى", "أَيْنَ", "كَيْفَ", "كَمْ",
    "كَانَ", "قَالَ", "جَعَلَ", "عَمِلَ", "عَلِمَ", "شَاءَ", "جَاءَ", "آمَنَ", "أَنْزَلَ", "خَلَقَ",
    "أَمَرَ", "عَبَدَ", "كَفَرَ", "قَتَلَ", "ظَلَمَ", "شَهِدَ", "هَدَى", "غَفَرَ", "أَخْرَجَ", "أَرْسَلَ",
    "رَزَقَ", "صَبَرَ", "عَرَفَ", "شَكَرَ", "ذَكَرَ", "تَابَ", "قَدَرَ", "دَعَا", "مَلَكَ", "أَنْفَقَ",
    "يَوْم", "أَرْض", "سَمَاء", "نَار", "جَنَّة", "جَهَنَّم", "كِتَاب", "آيَة", "شَيْء", "رَسُول",
    "نَبِيّ", "مَلَك", "رُوح", "نَفْس", "قَلْب", "مَوْت", "حَيَاة", "نُور", "حَقّ", "بَاطِل",
    "صِرَاط", "سَبِيل", "أَجْر", "ثَوَاب", "عَذَاب", "ذَنْب", "إِثْم", "دِين", "إِيمَان", "إِسْلَام",
    "صَلَاة", "زَكَاة", "حَجّ", "مَسْجِد", "قُرْآن", "كَلِمَة", "أَمْر", "حِسَاب", "سَاعَة", "فِتْنَة",
    "كَبِير", "عَظِيم", "شَدِيد", "قَرِيب", "بَعِيد", "كَثِير", "قَلِيل", "حَسَن", "سَيِّئ", "مُبِين",
    "أَلِيم", "حَمِيم", "صَالِح", "سَرِيع", "وَاحِد", "أَوَّل", "آخِر", "آخَر", "خَيْر", "شَرّ",
    "وَ", "فَ", "ثُمَّ", "أَوْ", "لَا", "مَا", "لَمْ", "لَنْ", "لَيْسَ", "إِنَّ",
    "أَنَّ", "لَكِنَّ", "بَلْ", "إِنْ", "لَوْ", "إِذَا", "إِذْ", "كَيْ", "كَلَّا", "إِلَّا",
    "ثُمَّ", "هُنَالِكَ", "حَيْثُ", "أَيَّانَ", "قَطُّ", "أَبَدًا", "إِذًا", "فَقَطْ", "عَسَى", "لَعَلَّ",
    "سَوْفَ", "سَ", "قَدْ", "لَنْ", "عِنْدَمَا", "كُلَّمَا", "يَوْمَئِذٍ", "هُنَا", "أَيْنَ", "كَيْفَ",
    "بِسْمِ اللَّهِ", "الْحَمْدُ لِلَّهِ", "إِنَّا لِلَّهِ", "إِنْ شَاءَ اللَّهُ", "سُبْحَانَ اللَّهِ", "الْكِتَاب", "يَا أَيُّهَا",
    "لَا إِلَهَ إِلَّا اللَّهُ", "الْغَيْب", "السَّاعَة", "رَحْمَة", "هُدًى", "بَيِّنَة", "ذِكْر",
    "حِكْمَة", "نِعْمَة", "عِبَادَة", "تَقْوَى", "مَغْفِرَة", "جِهَاد",
]

# Example phrases from vocabulary
VOCAB_EXAMPLES = [
    "رَبِّ الْعَالَمِينَ",
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
]

# Reading rule examples
READING_RULE_EXAMPLES = [
    "ثَا",      # Madd Attabi3i
    "خَاءَ",    # Madd El Badal
    "ظَاهِرًا", # Madd El 3iwad
    "كِتَابُهُۥ", # Madd As-silla soghra
    "زِيِّيٍ",  # Madd At-tamkin
    "ءَاآلْآنَ", # Madd El Alifaat
    "إِلَٰهَ",  # Les 7 Alifs
]

# Surah Al-Fatiha verses (Day 30)
FATIHA_VERSES = [
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    "الرَّحْمَٰنِ الرَّحِيمِ",
    "مَالِكِ يَوْمِ الدِّينِ",
    "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
]

ALL_TEXTS = list(set(VOCAB_WORDS + VOCAB_EXAMPLES + READING_RULE_EXAMPLES + FATIHA_VERSES))

async def main():
    tasks = []
    for text in ALL_TEXTS:
        if text in mapping:
            continue
        fname = make_filename(text)
        mapping[text] = fname
        tasks.append((text, os.path.join(AUDIO_DIR, fname)))

    if not tasks:
        print("All audio already exists.")
        return

    print(f"Generating {len(tasks)} new audio files...")
    sem = asyncio.Semaphore(5)
    async def gen(text, path):
        async with sem:
            await generate_one(text, path)
    await asyncio.gather(*(gen(t, p) for t, p in tasks))

    with open(MAPPING_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)

    print(f"Done. Total mappings: {len(mapping)}")

if __name__ == "__main__":
    asyncio.run(main())
