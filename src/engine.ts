import type { BandCombination, BandColor, WeightGroup, ClosestResult } from './types';
import { BANDS, MAX_WEIGHT } from './constants';

/**
 * Generates all valid band combinations up to MAX_WEIGHT.
 * 
 * Each band color can only be used once (distinct subsets).
 * With 5 bands, there are at most 2^5 - 1 = 31 non-empty subsets.
 * 
 * @returns Array of all valid BandCombination objects
 */
export function generateAllCombinations(): BandCombination[] {
  const combinations: BandCombination[] = [];

  // Recursive subset generator — each band is either included or not
  function generate(startIndex: number, currentBands: BandColor[], currentWeight: number): void {
    // If we have at least one band, record this combination
    if (currentBands.length > 0) {
      combinations.push({
        bands: [...currentBands],
        totalWeight: Math.round(currentWeight * 10) / 10,
      });
    }

    // Try adding each band from startIndex onwards; use i+1 to prevent reuse
    for (let i = startIndex; i < BANDS.length; i++) {
      const nextWeight = currentWeight + BANDS[i].weight;
      if (nextWeight <= MAX_WEIGHT) {
        currentBands.push(BANDS[i].color);
        generate(i + 1, currentBands, nextWeight);
        currentBands.pop();
      }
    }
  }

  generate(0, [], 0);
  return combinations;
}

/**
 * Groups combinations by their total weight, sorted by weight.
 * Multiple combinations can produce the same total weight.
 * 
 * @param combinations - All generated combinations
 * @returns Array of WeightGroup objects sorted by weight
 */
export function groupByWeight(combinations: BandCombination[]): WeightGroup[] {
  const weightMap = new Map<number, BandCombination[]>();

  for (const combo of combinations) {
    const weight = combo.totalWeight;
    if (!weightMap.has(weight)) {
      weightMap.set(weight, []);
    }
    weightMap.get(weight)!.push(combo);
  }

  // Sort each group's combinations: fewer bands first, then by band composition
  const groups: WeightGroup[] = [];
  for (const [weight, combos] of weightMap) {
    combos.sort((a, b) => {
      if (a.bands.length !== b.bands.length) return a.bands.length - b.bands.length;
      return a.bands.join(',').localeCompare(b.bands.join(','));
    });
    groups.push({ weight, combinations: combos });
  }

  // Sort groups by weight ascending
  groups.sort((a, b) => a.weight - b.weight);
  return groups;
}

/**
 * Finds the combination whose total weight is closest to the target.
 * 
 * Tie-breaking rules:
 * 1. Prefer fewer total bands
 * 2. Then prefer lower total weight
 * 
 * @param targetWeight - The desired weight in kg
 * @param combinations - All available combinations
 * @returns ClosestResult or null if no combinations exist
 */
export function findClosestCombination(
  targetWeight: number,
  combinations: BandCombination[]
): ClosestResult | null {
  if (combinations.length === 0 || targetWeight <= 0) return null;

  let bestCombo: BandCombination | null = null;
  let bestDiff = Infinity;

  for (const combo of combinations) {
    const diff = Math.abs(combo.totalWeight - targetWeight);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestCombo = combo;
    } else if (diff === bestDiff && bestCombo) {
      // Tie-breaking: prefer fewer bands
      if (combo.bands.length < bestCombo.bands.length) {
        bestCombo = combo;
      } else if (combo.bands.length === bestCombo.bands.length) {
        // Then prefer lower total weight
        if (combo.totalWeight < bestCombo.totalWeight) {
          bestCombo = combo;
        }
      }
    }
  }

  if (!bestCombo) return null;

  return {
    targetWeight,
    closestCombination: bestCombo,
    difference: Math.round((bestCombo.totalWeight - targetWeight) * 10) / 10,
  };
}

/**
 * Formats a combination result as a plain text string for clipboard copy.
 */
export function formatResultText(result: ClosestResult): string {
  const bandNames = result.closestCombination.bands.join(' + ');
  const sign = result.difference >= 0 ? '+' : '';
  return [
    `Target: ${result.targetWeight} kg`,
    `Closest: ${result.closestCombination.totalWeight} kg`,
    `Difference: ${sign}${result.difference} kg`,
    `Bands: ${bandNames}`,
  ].join('\n');
}

/**
 * Exports all weight groups to a CSV string.
 */
export function exportToCSV(groups: WeightGroup[]): string {
  const rows: string[] = ['Weight (kg),Combinations'];
  for (const group of groups) {
    const combos = group.combinations
      .map((c) => c.bands.join(' + '))
      .join(' | ');
    // Escape commas in combination strings
    rows.push(`${group.weight},"${combos}"`);
  }
  return rows.join('\n');
}
