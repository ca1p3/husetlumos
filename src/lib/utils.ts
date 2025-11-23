import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sequence name translations
const sequenceNameMap: Record<string, string> = {
  "01 Bring On the Holidays.fseq": "Bring On the Holidays",
  "01 The Greatest Show Amazon Edited.fseq": "The Greatest Show",
  "02 - Dance Mode.fseq": "Dance Mode",
  "A Christmas Monologue.fseq": "A Christmas Monologue",
  "Angels [Glory To God].fseq": "Angels (Glory To God)",
  "Drummer Boy.fseq": "Drummer Boy",
  "Fat Santa [RHKIWWGsexQ].fseq": "Fat Santa",
  "From Now On 2025.fseq": "From Now On",
  "Grinch part1 v1.fseq": "Grinch Del 1",
  "Grinch part2 v1.fseq": "Grinch Del 2",
  "Grinch part3 v1.fseq": "Grinch Del 3",
  "Grinch part4 v1.fseq": "Grinch Del 4",
  "Gwen Stefani - You Make It Feel Like Christmas (Audio) ft. Blake Shelton.fseq": "You Make It Feel Like Christmas",
  "intro greatest show.fseq": "Intro Greatest Show",
  "Jingle Bell Rock.fseq": "Jingle Bell Rock",
  "julshow_intro_musik.fseq": "Intro",
  "julshow_mellanakt_1_musik.fseq": "Mellanakt 1",
  "julshow_mellanakt_2_musik.fseq": "Mellanakt 2",
  "julshow_mellanakt_3_musik.fseq": "Mellanakt 3",
  "julshow_mellanakt_4_musik.fseq": "Mellanakt 4",
  "julshow_mellanakt_slut_musik.fseq": "Mellanakt Slut",
  "KPop Demon Hunters - Golden.fseq": "Golden",
  "Let It Go (From FrozenSoundtrack Version).fseq": "Let It Go",
  "Magic.fseq": "Magic",
  "Matt Maher - Born On That Day (Official Audio).fseq": "Born On That Day",
  "Nervo - Do They Know It's Christmas.fseq": "Do They Know It's Christmas",
  "panic-at-the-disco-into-the-unknown-from-frozen-2.fseq": "Into the Unknown",
  "Pentatonix - Kid On Christmas (Yule Log Audio) ft. Meghan Trainor.fseq": "Kid On Christmas",
  "_Sounding Joy_.fseq": "Sounding Joy",
  "TobyMac - Light Of Christmas (Audio) ft. Owl City.fseq": "Light Of Christmas",
  "windowfx.fseq": "Window FX",
  "Christmas Every Day - Simple Plan (Lyric Video).fseq": "Christmas Every Day"
};

export function formatSequenceName(fileName: string): string {
  // Check if we have a direct mapping
  if (sequenceNameMap[fileName]) {
    return sequenceNameMap[fileName];
  }
  
  // Fallback: clean up the filename
  return fileName
    .replace(/\.fseq$/, '') // Remove .fseq extension
    .replace(/^\d+\s*-?\s*/, '') // Remove leading numbers
    .replace(/\s*\[.*?\]\s*/g, ' ') // Remove brackets and content
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}
