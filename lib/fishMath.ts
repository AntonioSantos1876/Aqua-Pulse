// lib/fishMath.ts
// Domain logic for fish stock biomass and feeding calculations

export interface FishInputs {
  stockCount: number;
  fishAge: 'Smolt' | 'Grow-out' | 'Harvest';
  cageDiameter: number;
  fishType: string;
}

export interface FeedRecommendationResult {
  estimatedBiomassKg: number;
  recommendedDailyFeedKg: number;
  recommendedFeedFrequencyPerDay: number;
  recommendedDispenseDurationSec: number;
  recommendedSpreaderLevel: number;
}

const CONSTANTS = {
  // Approximate mass per fish at different stages (in kg)
  avgMass: {
    'Smolt': 0.15,
    'Grow-out': 1.2,
    'Harvest': 4.5,
  },
  // Feeding rate % of total body weight per day
  feedRatePercent: {
    'Smolt': 2.5,
    'Grow-out': 1.2,
    'Harvest': 0.5,
  },
  // Feeder hardware discharge rate in kg per second
  hardwareDischargeRateKgPerSec: 0.15,
};

export function calculateFeedRecommendation(inputs: FishInputs): FeedRecommendationResult {
  const avgMassKg = CONSTANTS.avgMass[inputs.fishAge] || 1.0;
  
  // 1. Calculate Estimated Biomass
  const estimatedBiomassKg = inputs.stockCount * avgMassKg;

  // 2. Calculate Daily Feed
  const feedRate = CONSTANTS.feedRatePercent[inputs.fishAge] || 1.0;
  const recommendedDailyFeedKg = estimatedBiomassKg * (feedRate / 100);

  // 3. Recommended Frequency based on age
  let frequency = 4;
  if (inputs.fishAge === 'Smolt') frequency = 6;
  if (inputs.fishAge === 'Harvest') frequency = 2;

  // 4. Calculate Dispense Duration per feed
  const feedPerCycleKg = recommendedDailyFeedKg / frequency;
  const recommendedDispenseDurationSec = Math.round(feedPerCycleKg / CONSTANTS.hardwareDischargeRateKgPerSec);

  // 5. Spreader behavior based on cage size
  // Larger cage needs wider spread (higher motor level)
  let spreaderLevel = Math.round(inputs.cageDiameter / 2);
  spreaderLevel = Math.max(3, Math.min(10, spreaderLevel));

  return {
    estimatedBiomassKg,
    recommendedDailyFeedKg,
    recommendedFeedFrequencyPerDay: frequency,
    recommendedDispenseDurationSec,
    recommendedSpreaderLevel: spreaderLevel,
  };
}
