import { useState } from 'react';
import type { TabId } from './types';
import { useCombinations } from './hooks/useCombinations';
import { Header } from './components/Header';
import { CalculatorTab } from './components/CalculatorTab';
import { CombinationsTab } from './components/CombinationsTab';

/**
 * Root application component.
 * Manages tab state and passes pre-computed combination data to child tabs.
 */
function App() {
  const [activeTab, setActiveTab] = useState<TabId>('calculator');
  const { allCombinations, weightGroups, stats } = useCombinations();

  return (
    <div className="min-h-screen pb-12">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'calculator' ? (
          <CalculatorTab allCombinations={allCombinations} />
        ) : (
          <CombinationsTab weightGroups={weightGroups} stats={stats} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-[var(--color-text-muted)] pb-6">
        <p>
          Resistance Band Weight Calculator — Built for fitness enthusiasts
        </p>
      </footer>
    </div>
  );
}

export default App;
