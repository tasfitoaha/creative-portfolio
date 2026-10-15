import { useState } from 'react';
import GlassPanel from '@/components/GlassPanel';
import { SCRIPTS, BRAND_WORKS } from '@/data/portfolio';
import { Terminal, Copy, Check, Filter, ImageIcon, Calculator, ExternalLink, Code2 } from 'lucide-react';
import type { PageId } from '@/data/portfolio';

interface SpecialtiesPageProps {
  onNavigate: (page: PageId) => void;
}

export default function SpecialtiesPage({ onNavigate }: SpecialtiesPageProps) {
  const [activeScript, setActiveScript] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(BRAND_WORKS.map((w) => w.category)))];
  const filteredWorks =
    activeFilter === 'All'
      ? BRAND_WORKS
      : BRAND_WORKS.filter((w) => w.category === activeFilter);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPTS[activeScript].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-6 pb-20 pt-32">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Specialties
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/50">
            Custom automation scripts and brand design works side by side.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left: Code container */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white/80">
              <Terminal className="h-5 w-5 text-cyan-400" />
              Custom Scripts
            </h2>

            <GlassPanel className="overflow-hidden">
              {/* Script tabs */}
              <div className="flex border-b border-white/10 bg-white/[0.02]">
                {SCRIPTS.map((script, i) => (
                  <button
                    key={script.filename}
                    onClick={() => setActiveScript(i)}
                    className={`relative px-4 py-3 font-mono text-xs transition-all ${
                      activeScript === i
                        ? 'text-cyan-300'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {script.filename}
                    {activeScript === i && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-cyan-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Script description */}
              <div className="border-b border-white/5 px-5 py-3">
                <p className="text-sm text-white/45">
                  {SCRIPTS[activeScript].description}
                </p>
              </div>

              {/* Code block */}
              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/80"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
                <pre className="max-h-[420px] overflow-auto p-5 text-xs leading-relaxed">
                  <code className="font-mono text-white/70">
                    {SCRIPTS[activeScript].code}
                  </code>
                </pre>
              </div>
            </GlassPanel>

            {/* Pythagorean Relation Finder project card */}
            <GlassPanel className="mt-6 p-6 transition-all duration-300 hover:border-violet-400/30 hover:bg-white/[0.06] hover:shadow-[0_0_24px_rgba(139,92,246,0.12)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                  <Calculator className="h-6 w-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Pythagorean Relation Finder
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    A tool that searches for integer relationships between perfect squares.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => onNavigate('pythagorean')}
                      className="flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,153,255,0.15)]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Tool
                    </button>
                    <button
                      onClick={() => onNavigate('pythagorean')}
                      className="flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/20"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      View Code
                    </button>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Right: Masonry photo grid */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white/80">
              <ImageIcon className="h-5 w-5 text-cyan-400" />
              Brand Works
            </h2>

            {/* Filter buttons */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-white/30" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    activeFilter === cat
                      ? 'border border-cyan-400/30 bg-cyan-500/10 text-cyan-200'
                      : 'border border-white/10 bg-white/5 text-white/40 hover:text-white/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Masonry grid */}
            <div className="columns-2 gap-4 [column-fill:balance]">
              {filteredWorks.map((work, i) => (
                <div
                  key={`${work.title}-${i}`}
                  className="mb-4 break-inside-avoid"
                >
                  <GlassPanel className="group overflow-hidden p-0 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]">
                    <div className="overflow-hidden">
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        loading="lazy"
                        className="w-full transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-white/85">{work.title}</p>
                      <p className="mt-1 text-xs text-cyan-400/60">{work.category}</p>
                    </div>
                  </GlassPanel>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
