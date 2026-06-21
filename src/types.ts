/**
 * Core data types for the Resistance Band Weight Calculator
 */

/** A single resistance band with its color and weight */
export interface Band {
  color: BandColor;
  weight: number;
}

/** Available band colors */
export type BandColor = 'Yellow' | 'Green' | 'Red' | 'Blue' | 'Black';

/** A combination of bands with its total weight */
export interface BandCombination {
  bands: BandColor[];
  totalWeight: number;
}

/** A weight value with all combinations that produce it */
export interface WeightGroup {
  weight: number;
  combinations: BandCombination[];
}

/** Result of finding the closest combination to a target weight */
export interface ClosestResult {
  targetWeight: number;
  closestCombination: BandCombination;
  difference: number;
}

/** Tab identifiers */
export type TabId = 'calculator' | 'combinations';

/** Sort direction for the combinations table */
export type SortDirection = 'asc' | 'desc';
