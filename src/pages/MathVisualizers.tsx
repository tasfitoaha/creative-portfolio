import { useState } from 'react';
import GlassPanel from '@/components/GlassPanel';
import PythagoreanCalculator from '@/components/PythagoreanCalculator';
import UlamSpiral from '@/components/UlamSpiral';
import CollatzVisualizer from '@/components/CollatzVisualizer';
import { ArrowLeft, Calculator, Grid3x3, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type MathTab = 'pythagorean' | 'ulam' | 'collatz';

const TABS: { id: MathTab; label: string; icon: typeof Calculator }[] = [
  { id: 'pythagorean', label: 'Pythagorean Finder', icon: Calculator },
  { id: 'ulam', label: "Ulam's Prime Spiral", icon: Grid3x3 },
  { id: 'collatz', label: 'Collatz Conjecture', icon: TrendingUp },
];

export default function MathVisualizers() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<MathTab>('pythagorean');

  return (
    <div className="px-6 pb-20 pt-32">
      <section className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => navigate('/specialties')}
          className="mb-6 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Specialties
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Calculator className="h-7 w-7 text-cyan-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Mathematical Visualizers
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/50">
            A unified panel of computational tools — integer relation search, prime
            spiral plotting, and the Collatz conjecture trajectory.
          </p>
        </div>

        {/* Main tabs */}
        <div className="mb-6 flex gap-1 border-b border-white/10">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                  tab === t.id ? 'text-cyan-300' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                {tab === t.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === 'pythagorean' && <PythagoreanCalculator />}
        {tab === 'ulam' && <UlamSpiral />}
        {tab === 'collatz' && <CollatzVisualizer />}
      </section>
    </div>
  );
}
