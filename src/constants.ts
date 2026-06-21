import type { Band, BandColor } from './types';

/**
 * All available resistance bands with their weights in kg.
 * These are standard resistance band weights used in fitness training.
 */
export const BANDS: Band[] = [
  { color: 'Yellow', weight: 4.5 },
  { color: 'Green', weight: 6.8 },
  { color: 'Red', weight: 9.0 },
  { color: 'Blue', weight: 11.3 },
  { color: 'Black', weight: 13.6 },
];

/** Maximum target weight in kg (sum of all bands = 45.2) */
export const MAX_WEIGHT = 45.2;

/** Band color to emoji mapping */
export const BAND_EMOJI: Record<BandColor, string> = {
  Yellow: '🟨',
  Green: '🟩',
  Red: '🟥',
  Blue: '🟦',
  Black: '⬛',
};

/** Band color to CSS class mapping */
export const BAND_CLASS: Record<BandColor, string> = {
  Yellow: 'band-yellow',
  Green: 'band-green',
  Red: 'band-red',
  Blue: 'band-blue',
  Black: 'band-black',
};
