import type { BandColor } from '../types';
import { BAND_CLASS, BAND_EMOJI } from '../constants';

interface BandStripProps {
  color: BandColor;
  showWeight?: boolean;
  weight?: number;
  animationDelay?: number;
}

/**
 * Visual representation of a resistance band as a colored strip/badge.
 * Includes emoji, color name, and optional weight display.
 */
export function BandStrip({ color, showWeight, weight, animationDelay = 0 }: BandStripProps) {
  return (
    <span
      className={`band-strip animate-band-stretch ${BAND_CLASS[color]}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <span className="text-base">{BAND_EMOJI[color]}</span>
      <span>{color}</span>
      {showWeight && weight !== undefined && (
        <span className="text-xs opacity-75">({weight} kg)</span>
      )}
    </span>
  );
}

interface BandBadgeListProps {
  bands: BandColor[];
  animated?: boolean;
}

/**
 * Renders a list of BandStrips, typically used to display a combination.
 */
export function BandBadgeList({ bands, animated = true }: BandBadgeListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {bands.map((color, idx) => (
        <BandStrip
          key={`${color}-${idx}`}
          color={color}
          animationDelay={animated ? idx * 80 : 0}
        />
      ))}
    </div>
  );
}
