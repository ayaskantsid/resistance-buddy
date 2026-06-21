import { useState, useMemo, useCallback } from 'react';
import type { WeightGroup, SortDirection } from '../types';
import { exportToCSV } from '../engine';
import { BandBadgeList } from './BandStrip';

interface CombinationsTabProps {
  weightGroups: WeightGroup[];
  stats: {
    uniqueWeights: number;
    totalCombinations: number;
    highestWeight: number;
  };
}

/**
 * All Combinations Tab — displays every achievable weight with
 * all band combinations that produce it. Supports search, sort, and CSV export.
 */
export function CombinationsTab({ weightGroups, stats }: CombinationsTabProps) {
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  // Filter and sort weight groups
  const filteredGroups = useMemo(() => {
    let groups = weightGroups;

    // Filter by search (match weight)
    if (search.trim()) {
      const query = search.trim();
      groups = groups.filter((g) =>
        g.weight.toFixed(1).includes(query) || g.weight.toString().includes(query)
      );
    }

    // Sort
    if (sortDir === 'desc') {
      return [...groups].reverse();
    }
    return groups;
  }, [weightGroups, search, sortDir]);

  const handleExportCSV = useCallback(() => {
    const csv = exportToCSV(weightGroups);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resistance-band-combinations.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [weightGroups]);

  const toggleSort = () => {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div
      id="panel-combinations"
      role="tabpanel"
      aria-labelledby="tab-combinations"
      className="animate-fade-in"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">
              {stats.uniqueWeights}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Achievable Weights</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
              {stats.totalCombinations}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Total Combinations</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-accent-light)]">
              {stats.highestWeight.toFixed(1)}
              <span className="text-sm text-[var(--color-text-muted)] ml-1">kg</span>
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Highest Weight</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="combination-search"
              type="text"
              inputMode="decimal"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by weight..."
              className="input-glow w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-all duration-200"
            />
          </div>

          {/* Sort toggle */}
          <button
            id="sort-toggle-btn"
            onClick={toggleSort}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {sortDir === 'asc' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              )}
            </svg>
            {sortDir === 'asc' ? 'Ascending' : 'Descending'}
          </button>

          {/* Export CSV */}
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--color-accent-dark)] text-white hover:bg-[var(--color-accent)] transition-all duration-200 cursor-pointer shadow-lg shadow-[rgba(34,197,94,0.15)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Table */}
        {filteredGroups.length > 0 ? (
          <div className="glass-card overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] border-b border-[var(--color-border)] bg-[rgba(0,0,0,0.2)]">
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Weight
              </div>
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Available Combinations
              </div>
            </div>

            {/* Table rows */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredGroups.map((group, idx) => (
                <div
                  key={group.weight}
                  className={`grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] items-center border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card-hover)] transition-colors duration-150 ${
                    idx % 2 === 0 ? 'bg-transparent' : 'bg-[rgba(0,0,0,0.08)]'
                  }`}
                >
                  {/* Weight cell */}
                  <div className="px-4 py-3">
                    <span className="text-base font-bold text-[var(--color-accent)]">
                      {group.weight.toFixed(1)}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] ml-1">kg</span>
                  </div>

                  {/* Combinations cell */}
                  <div className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {group.combinations.map((combo, ci) => (
                        <div
                          key={ci}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-xs"
                        >
                          <BandBadgeList bands={combo.bands} animated={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-[rgba(0,0,0,0.2)] text-xs text-[var(--color-text-muted)] text-center border-t border-[var(--color-border)]">
              Showing {filteredGroups.length} of {stats.uniqueWeights} achievable weights
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 text-center animate-fade-in">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[var(--color-text-secondary)] text-sm">
              No weights found matching "{search}"
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
