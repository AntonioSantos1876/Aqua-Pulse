// types/fishType.ts

export interface FishFeedingProfile {
  minTempCelsius: number;
  maxTempCelsius: number;
  feedsPerDay: number;
  portionGramsDefault: number;
  portionGramsMin: number;
  portionGramsMax: number;
  feedIntervalHours: number;
  notes: string;
}

export interface FishType {
  id: string;
  name: string;
  scientificName: string;
  icon: string;             // emoji or icon key
  isAvailable: boolean;     // false = "Coming Soon"
  description: string;
  feedingProfile: FishFeedingProfile;
  color: string;            // accent color for this fish type
}
