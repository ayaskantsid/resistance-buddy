import { useState, useMemo, useCallback } from 'react';
import type { BandCombination, ClosestResult } from '../types';
import { BANDS, MAX_WEIGHT } from '../constants';
import { findClosestCombination, formatResultText } from '../engine';
import { BandBadgeList, BandStrip } from './BandStrip';
import { useClipboard } from '../hooks/useClipboard';

interface CalculatorTabProps {
  allCombinations: BandCombination[];
}

/**
 * Calculator Tab — allows the user to input a target weight
 * and instantly finds the closest band combination.
 */
export function CalculatorTab({ allCombinations }: CalculatorTabProps) {
  const [inputValue, setInputValue] = useState('');
  const { copied, copy } = useClipboard();

  const targetWeight = parseFloat(inputValue);
  const isValidInput = !isNaN(targetWeight) && targetWeight > 0 && targetWeight <= MAX_WEIGHT;

  // Find closest match as user types (instant calculation)
  const result = useMemo<ClosestResult | null>(() => {
    if (!isValidInput) return null;
    return findClosestCombination(targetWeight, allCombinations);
  }, [targetWeight, isValidInput, allCombinations]);

  const handleCopy = useCallback(() => {
    if (result) {
      copy(formatResultText(result));
    }
  }, [result, copy]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty, digits, and one decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  return (
    <div
      id="panel-calculator"
      role="tabpanel"
      aria-labelledby="tab-calculator"
      className="animate-fade-in"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Band reference card */}
        <div className="glass-card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">
            Available Bands
          </h2>
          <div className="flex flex-wrap gap-2">
            {BANDS.map((band) => (
              <BandStrip
                key={band.color}
                color={band.color}
                showWeight
                weight={band.weight}
                animationDelay={0}
              />
            ))}
          </div>
        </div>

        {/* Input section */}
        <div className="glass-card p-6 animate-pulse-glow">
          <label
            htmlFor="weight-input"
            className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
          >
            Target Weight
          </label>
          <div className="relative">
            <input
              id="weight-input"
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter target weight (kg)"
              autoComplete="off"
              className="input-glow w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-lg font-semibold text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-all duration-200"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)] font-medium">
              kg
            </span>
          </div>
          {inputValue && !isValidInput && (
            <p className="mt-2 text-sm text-red-400">
              {parseFloat(inputValue) > MAX_WEIGHT
                ? `Maximum weight is ${MAX_WEIGHT} kg`
                : 'Please enter a valid weight'}
            </p>
          )}
          {!inputValue && (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Start typing to find the closest band combination (max {MAX_WEIGHT} kg)
            </p>
          )}
        </div>

        {/* Results */}
        {result ? (
          <div className="glass-card p-6 animate-slide-up" key={result.closestCombination.totalWeight + '-' + result.targetWeight}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-accent)]">
                Result
              </h2>
              <button
                id="copy-result-btn"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent-dark)] transition-all duration-200 cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-accent)]"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Target</p>
                <p className="text-xl font-bold text-[var(--color-text-primary)]">
                  {result.targetWeight.toFixed(1)}
                  <span className="text-xs ml-1 text-[var(--color-text-muted)]">kg</span>
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Closest</p>
                <p className="text-xl font-bold text-[var(--color-accent)]">
                  {result.closestCombination.totalWeight.toFixed(1)}
                  <span className="text-xs ml-1 text-[var(--color-text-muted)]">kg</span>
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Difference</p>
                <p className={`text-xl font-bold ${result.difference === 0 ? 'text-[var(--color-accent)]' : result.difference > 0 ? 'text-amber-400' : 'text-sky-400'}`}>
                  {result.difference > 0 ? '+' : ''}
                  {result.difference.toFixed(1)}
                  <span className="text-xs ml-1 text-[var(--color-text-muted)]">kg</span>
                </p>
              </div>
            </div>

            {/* Band display */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">
                Bands Required ({result.closestCombination.bands.length})
              </p>
              <BandBadgeList bands={result.closestCombination.bands} animated />
            </div>
          </div>
        ) : (
          inputValue === '' && (
            <div className="glass-card p-8 text-center animate-fade-in">
              <div className="text-4xl mb-3">🏋️</div>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Enter a target weight above to find the closest band combination.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
