// constants/fishTypes.ts
// Fish type registry for AquaPulse
// Only Tilapia is currently active; others are "Coming Soon"

import { FishType } from '../types/fishType';

export const FISH_TYPES: FishType[] = [
  {
    id: 'tilapia',
    name: 'Tilapia',
    scientificName: 'Oreochromis niloticus',
    icon: '🐟',
    isAvailable: false,
    description:
      'Nile Tilapia — a hardy freshwater/brackish fish ideal for automated feeding systems. ' +
      'Feed 3–4 times daily with high-protein pellets.',
    color: '#00D4FF',
    feedingProfile: {
      minTempCelsius: 22,
      maxTempCelsius: 30,
      feedsPerDay: 4,
      portionGramsDefault: 250,
      portionGramsMin: 100,
      portionGramsMax: 500,
      feedIntervalHours: 6,
      notes:
        'Tilapia feeding rate: 3–5% body weight per day. Reduce feeding below 22°C. ' +
        'Use floating pellets sized 2–3mm for juveniles.',
    },
  },
  {
    id: 'salmon',
    name: 'Salmon',
    scientificName: 'Salmo salar',
    icon: '🐡',
    isAvailable: false,
    description: 'Atlantic Salmon — cold-water cage aquaculture. Coming in a future update.',
    color: '#FF6B6B',
    feedingProfile: {
      minTempCelsius: 8,
      maxTempCelsius: 18,
      feedsPerDay: 6,
      portionGramsDefault: 400,
      portionGramsMin: 200,
      portionGramsMax: 800,
      feedIntervalHours: 4,
      notes: 'Salmon feed profile — coming soon.',
    },
  },
  {
    id: 'catfish',
    name: 'Catfish',
    scientificName: 'Clarias gariepinus',
    icon: '🐠',
    isAvailable: false,
    description: 'African Catfish — bottom feeder with high growth rate. Coming in a future update.',
    color: '#A8916A',
    feedingProfile: {
      minTempCelsius: 20,
      maxTempCelsius: 32,
      feedsPerDay: 3,
      portionGramsDefault: 300,
      portionGramsMin: 150,
      portionGramsMax: 600,
      feedIntervalHours: 8,
      notes: 'Catfish feed profile — coming soon.',
    },
  },
  {
    id: 'snapper',
    name: 'Snapper',
    scientificName: 'Lutjanus campechanus',
    icon: '🦈',
    isAvailable: true,
    description: 'Red Snapper — marine species requiring saltwater cages. Calibrated for offshore systems.',
    color: '#FF8C42',
    feedingProfile: {
      minTempCelsius: 18,
      maxTempCelsius: 28,
      feedsPerDay: 3,
      portionGramsDefault: 350,
      portionGramsMin: 150,
      portionGramsMax: 700,
      feedIntervalHours: 8,
      notes: 'Snapper feed profile — coming soon.',
    },
  },
  {
    id: 'grouper',
    name: 'Grouper',
    scientificName: 'Epinephelus coioides',
    icon: '🐙',
    isAvailable: false,
    description:
      'Orange-spotted Grouper — high-value marine fish for offshore cage culture. Coming in a future update.',
    color: '#9B59B6',
    feedingProfile: {
      minTempCelsius: 20,
      maxTempCelsius: 30,
      feedsPerDay: 2,
      portionGramsDefault: 450,
      portionGramsMin: 200,
      portionGramsMax: 900,
      feedIntervalHours: 12,
      notes: 'Grouper feed profile — coming soon.',
    },
  },
];

export const getFishTypeById = (id: string): FishType | undefined =>
  FISH_TYPES.find((f) => f.id === id);

export const getActiveFishTypes = (): FishType[] =>
  FISH_TYPES.filter((f) => f.isAvailable);
