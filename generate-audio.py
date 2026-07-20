import asyncio
import edge_tts
import os
import json
import hashlib

VOICE = "ar-SA-HamedNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")
RATE = "-10%"

LETTERS = [
    "ب", "ت", "ث", "ن", "ي", "م", "ش", "ج", "ح", "خ",
    "س", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك",
    "ل", "ه", "ر", "و", "ز", "د", "ذ", "ء", "ة"
]

HARAKAT_MARKS = {
    "fatha": "\u064E",
    "damma": "\u064F",
    "kasra": "\u0650",
}

EXERCISE_WORDS = [
    "بَبَ", "بِبِ", "بُبُ", "بَبُ", "بِبُ", "بَبِ",
    "تَبَ", "بَتَ", "تِبِ", "تَتَ", "بِتِ", "تِتِ",
    "ثَبَ", "بَثَ", "ثِبِ", "تَثَ", "ثَتَ", "ثِثِ",
    "نَبْتَ", "بِنْتٌ", "ثَبِتَ", "تَنْبِيهٌ", "نَتْوَ", "بَنَاءٌ",
    "يَدٌ", "بَيْتٌ", "ثَوْبٌ", "نَيِّلٌ", "يَبِيسٌ", "بِيَانٌ",
    "مَاءٌ", "مِيمٌ", "يَمِينٌ", "نِيَامٌ", "تَمِيمٌ", "بُطُومٌ",
    "شَمْسٌ", "شِيْمَةٌ", "مَشَتٌ", "يَشِينُ", "شَبِيبَةٌ", "ثَيْشَمٌ",
    "جَمَلٌ", "جَنْبٌ", "شَجَرَةٌ", "نِجَايَةٌ", "جِيمٌ", "مِجَنٌّ",
    "حِمَارٌ", "حَجٌّ", "حَشِيشٌ", "جِحَافٌ", "حَيَاةٌ", "شِحَاحٌ",
    "خِيَارٌ", "خَيْلٌ", "خَيْمَةٌ", "حَاخٌ", "خِتَانٌ", "جَخٌّ",
    "سَمَكٌ", "سِيَاسَةٌ", "سُحُبٌ", "جَسَدٌ", "حَاسٌّ", "شَاسِعٌ",
    "صُورَةٌ", "صَبِيٌّ", "صِحَاحٌ", "حَاصِلٌ", "جَاصِصٌ", "سِصَالٌ",
    "ضِفْدَعٌ", "ضُرُوسٌ", "ضَحَايَا", "صَضِيحٌ", "حَضِيرٌ", "شِضَاضٌ",
    "طَعَامٌ", "طَائِرٌ", "طَوِيلٌ", "ضَطِيعٌ", "حَطَبٌ", "شِطَطٌ",
    "ظِلٌّ", "ظَاهِرٌ", "ظَرِيفٌ", "طَظِيمٌ", "حَظِيظٌ", "شِظِّيَةٌ",
    "عَيْنٌ", "عِلْمٌ", "عَظِيمٌ", "طَعْمٌ", "حَاعٌ", "شَعِيرٌ",
    "غَيْمٌ", "غَزَالٌ", "غَنِيٌّ", "عَغِيبٌ", "حَاغٌ", "شَغَفٌ",
    "فِيلٌ", "فِئَةٌ", "فَوْقٌ", "عَفْوٌ", "حَافٌّ", "شِفَاءٌ",
    "قَمَرٌ", "قُوَّةٌ", "قَلْبٌ", "عِقَابٌ", "حَقِيقٌ", "شَاقٌّ",
    "كِتَابٌ", "كَبِيرٌ", "كَلِمَةٌ", "عُكَّةٌ", "حَاكِمٌ", "شَاكِيٌ",
    "لِسَانٌ", "لَيْلٌ", "لَحْمٌ", "حُلُولٌ", "شَالٌ",
    "هِدِيَّةٌ", "هَلَالٌ", "هِمَّةٌ", "عَهْدٌ", "حَالَةٌ", "شُهُودٌ",
    "رَمْلٌ", "رَحِيمٌ", "رِيَاحٌ", "عَرَبٌ", "حُرٌّ", "شَرَفٌ",
    "وَرْدَةٌ", "وَعْدٌ", "وَاسِعٌ", "عَوَدٌ", "حَاوٌ", "شَوْقٌ",
    "زَهْرَةٌ", "زَمَنٌ", "زَيْتٌ", "عَزِيزٌ", "حَازِمٌ", "شِزَارٌ",
    "دَرْسٌ", "دَاخِلٌ", "دِيَنٌ", "عَادٌ", "حَادٌّ", "شَدِيدٌ",
    "ذَهَبٌ", "ذَاكِرٌ", "ذَاتٌ", "عَاذٌ", "حَاذِقٌ", "شَاذٌّ",
    "أَبٌ", "أُمٌّ", "أَمْرٌ", "عَائِلَةٌ", "حَائِطٌ", "شَيْءٌ",
    "مَدْرَسَةٌ", "طَالِبَةٌ", "جَزِيرَةٌ", "عَائِشَةٌ", "حَدِيقَةٌ", "شَهَادَةٌ",
]

def make_filename(text):
    h = hashlib.md5(text.encode("utf-8")).hexdigest()[:12]
    return f"{h}.mp3"

async def generate_one(text, out_path):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(out_path)

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    mapping = {}
    tasks = []

    for letter in LETTERS:
        for harakat_name, mark in HARAKAT_MARKS.items():
            text = letter + mark
            fname = make_filename(text)
            mapping[text] = fname
            tasks.append((text, os.path.join(OUTPUT_DIR, fname)))

    for word in EXERCISE_WORDS:
        fname = make_filename(word)
        mapping[word] = fname
        tasks.append((word, os.path.join(OUTPUT_DIR, fname)))

    sem = asyncio.Semaphore(5)
    async def gen(text, path):
        async with sem:
            await generate_one(text, path)
    await asyncio.gather(*(gen(t, p) for t, p in tasks))

    with open(os.path.join(OUTPUT_DIR, "mapping.json"), "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)

    print(f"Generated {len(tasks)} audio files in {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
