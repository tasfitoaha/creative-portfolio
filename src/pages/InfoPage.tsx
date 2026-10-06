import GlassPanel from '@/components/GlassPanel';
import { EDUCATION, TECH_FOUNDATIONS } from '@/data/portfolio';
import { GraduationCap, School, Cpu, Smartphone, Terminal, Code2 } from 'lucide-react';

const TECH_ICONS = [Smartphone, Terminal, Code2];

export default function InfoPage() {
  return (
    <div className="px-6 pb-20 pt-32">
      <section className="mx-auto max-w-3xl">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-cyan-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Academic Credentials
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/50">
            A timeline of formal education and academic milestones.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute bottom-0 left-[27px] top-2 w-px bg-gradient-to-b from-cyan-400/40 via-cyan-400/20 to-transparent" />

          <div className="space-y-8">
            {EDUCATION.map((entry, i) => (
              <div key={i} className="relative flex gap-6">
                {/* Node */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-black/40 backdrop-blur-xl">
                  <School className="h-6 w-6 text-cyan-400" />
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-400/40" />
                    <span className="relative h-3 w-3 rounded-full bg-cyan-400" />
                  </span>
                </div>

                {/* Content */}
                <GlassPanel className="flex-1 p-6 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06]">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-sm font-bold text-cyan-300">
                      {entry.level}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {entry.institution}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {entry.detail}
                  </p>
                </GlassPanel>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Foundations */}
      <section className="mx-auto mt-20 max-w-5xl">
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <Cpu className="h-6 w-6 text-violet-400" />
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Technical Foundations
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/50">
            Self-directed engineering disciplines in logic compilation, system structures,
            and multi-platform deployment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TECH_FOUNDATIONS.map((tech, i) => {
            const Icon = TECH_ICONS[i] ?? Code2;
            return (
              <GlassPanel
                key={tech.name}
                className="p-8 transition-all duration-300 hover:border-violet-400/30 hover:bg-white/[0.06] hover:shadow-[0_0_24px_rgba(139,92,246,0.12)]"
              >
                <Icon className="mb-5 h-9 w-9 text-violet-400" />
                <h3 className="text-xl font-semibold text-white">{tech.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {tech.description}
                </p>
              </GlassPanel>
            );
          })}
        </div>
      </section>
    </div>
  );
}
