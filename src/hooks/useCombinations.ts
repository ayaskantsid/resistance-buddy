import { useMemo } from 'react';
import { generateAllCombinations, groupByWeight } from '../engine';
import type { BandCombination, WeightGroup } from '../types';

/**
 * Hook that generates all band combinations on first render
 * and memoizes the results. All downstream computations use these cached values.
 */
export function useCombinations() {
  const allCombinations = useMemo<BandCombination[]>(() => {
    return generateAllCombinations();
  }, []);

  const weightGroups = useMemo<WeightGroup[]>(() => {
    return groupByWeight(allCombinations);
  }, [allCombinations]);

  const stats = useMemo(() => {
    const uniqueWeights = weightGroups.length;
    const totalCombinations = allCombinations.length;
    const highestWeight = weightGroups.length > 0
      ? weightGroups[weightGroups.length - 1].weight
      : 0;

    return { uniqueWeights, totalCombinations, highestWeight };
  }, [allCombinations, weightGroups]);

  return { allCombinations, weightGroups, stats };
}
