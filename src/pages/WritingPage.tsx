import GlassPanel from '@/components/GlassPanel';
import { WRITINGS, type WritingEntry } from '@/data/portfolio';
import { BookOpen, Lock, Archive, Clock } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const STATUS_CONFIG: Record<
  WritingEntry['status'],
  { icon: typeof Clock; color: string; border: string; bg: string }
> = {
  forthcoming: {
    icon: Clock,
    color: 'text-cyan-300',
    border: 'border-cyan-400/20',
    bg: 'bg-cyan-500/5',
  },
  archival: {
    icon: Archive,
    color: 'text-amber-300',
    border: 'border-amber-400/20',
    bg: 'bg-amber-500/5',
  },
  restricted: {
    icon: Lock,
    color: 'text-red-300',
    border: 'border-red-400/20',
    bg: 'bg-red-500/5',
  },
};

export default function WritingPage() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={revealRef} className="px-6 pb-20 pt-32">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-cyan-400" />
            <h1 className="animate-fade-in text-glow cursor-default text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Writing
            </h1>
          </div>
          <p className="max-w-2xl animate-fade-in-delay-1 text-glow cursor-default text-lg leading-relaxed text-white/50">
            Manuscripts in development, archival experiments, and restricted internal
            projects.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {WRITINGS.map((entry) => {
            const cfg = STATUS_CONFIG[entry.status];
            const Icon = cfg.icon;
            return (
              <GlassPanel
                key={entry.title}
                data-reveal
                className={`reveal card-hover-lift overflow-hidden border ${cfg.border} hover:bg-white/[0.06] hover:shadow-2xl`}
              >
                <div className="p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full ${cfg.bg} px-3 py-1 text-xs font-medium ${cfg.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {entry.tag}
                    </span>
                  </div>

                  <h2 className="text-glow cursor-default text-2xl font-bold text-white">{entry.title}</h2>

                  <p className="text-glow mt-4 cursor-default leading-relaxed text-white/50">{entry.note}</p>

                  {entry.status === 'restricted' && (
                    <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-400/15 bg-red-500/5 px-4 py-3">
                      <Lock className="h-4 w-4 shrink-0 text-red-400/70" />
                      <span className="text-sm text-red-200/60">
                        This project is permanently sealed and will not be distributed.
                      </span>
                    </div>
                  )}

                  {entry.status === 'forthcoming' && (
                    <div className="mt-6 flex items-center gap-2 text-sm text-cyan-300/50">
                      <Clock className="h-4 w-4" />
                      Expected after October 2026
                    </div>
                  )}

                  {entry.status === 'archival' && (
                    <div className="mt-6 flex items-center gap-2 text-sm text-amber-300/50">
                      <Archive className="h-4 w-4" />
                      Archived — early developmental stage
                    </div>
                  )}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </section>
    </div>
  );
}
