import type { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

/**
 * Application header with title, subtitle, and tab navigation.
 * The tab indicator smoothly slides between tabs.
 */
export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(34,197,94,0.06)] to-transparent pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-0 sm:px-6 lg:px-8">
        {/* Title section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Fitness Tool
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-3">
            Resistance Band
            <span className="block bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] bg-clip-text text-transparent">
              Weight Calculator
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-md mx-auto">
            Find the closest band combination for your target weight.
          </p>
        </div>

        {/* Tab navigation */}
        <nav id="tab-navigation" className="relative flex justify-center" aria-label="Main navigation">
          <div className="relative inline-flex bg-[var(--color-bg-card)] rounded-xl p-1 border border-[var(--color-border)]">
            {/* Sliding indicator */}
            <div
              className="tab-indicator absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-[var(--color-accent-dark)] to-[var(--color-accent)] shadow-lg"
              style={{
                width: 'calc(50% - 4px)',
                transform: activeTab === 'calculator' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))',
              }}
            />

            <button
              id="tab-calculator"
              role="tab"
              aria-selected={activeTab === 'calculator'}
              aria-controls="panel-calculator"
              onClick={() => onTabChange('calculator')}
              className={`relative z-10 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer min-w-[140px] ${
                activeTab === 'calculator' ? 'text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculator
              </span>
            </button>

            <button
              id="tab-combinations"
              role="tab"
              aria-selected={activeTab === 'combinations'}
              aria-controls="panel-combinations"
              onClick={() => onTabChange('combinations')}
              className={`relative z-10 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer min-w-[140px] ${
                activeTab === 'combinations' ? 'text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                All Combinations
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
