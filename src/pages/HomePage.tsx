import GlassPanel from '@/components/GlassPanel';
import { BRAND } from '@/data/portfolio';
import { Mail, Phone, ArrowDown, PenTool, Code2, LayoutGrid } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';

const DISCIPLINES = [
  { color: 'cyan', label: 'Vector Graphic Layouts', icon: LayoutGrid, desc: 'Precision-engineered design systems — business cards, ID badges, publication templates, and marketing flyers built with geometric intent.', boxClass: '' },
  { color: 'blue', label: 'Psychological Literature', icon: PenTool, desc: 'Long-form manuscripts exploring fear mechanics, subconscious habits, the uncanny valley, and dual-language conceptual reflection.', boxClass: 'discipline-blue' },
  { color: 'violet', label: 'Background Script Utilities', icon: Code2, desc: 'Custom PowerShell, VBScript, and batch automation tools for document searching, system monitoring, and optimization workflows.', boxClass: 'discipline-violet' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={revealRef} className="px-6 pb-20 pt-32">
      {/* Hero */}
      <section className="mx-auto max-w-5xl pt-8">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/5 px-4 py-1.5 backdrop-blur-xl sm:inline-flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          <span className="text-sm font-medium text-cyan-200/90">Portfolio — v1.0</span>
        </div>

        <h1 className="animate-fade-in text-glow cursor-default text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
          {BRAND.name}
        </h1>

        <p className="mt-8 max-w-3xl animate-fade-in-delay-1 text-glow cursor-default text-lg leading-relaxed text-white/55 sm:text-xl">
          {BRAND.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap gap-3 animate-fade-in-delay-2">
          <button
            onClick={() => navigate('/specialties')}
            className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-7 py-3 font-medium text-cyan-100 backdrop-blur-xl transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,153,255,0.2)]"
          >
            View Specialties
          </button>
          <button
            onClick={() => navigate('/writing')}
            className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-medium text-white/75 backdrop-blur-xl transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
          >
            Read Writing
          </button>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:gap-8">
          <a
            href={`mailto:${BRAND.contacts.primary}`}
            className="flex items-center gap-3 text-sm text-white/45 transition-colors hover:text-cyan-300"
          >
            <Mail className="h-4 w-4" />
            {BRAND.contacts.primary}
          </a>
          <a
            href={`mailto:${BRAND.contacts.secondary}`}
            className="flex items-center gap-3 text-sm text-white/45 transition-colors hover:text-cyan-300"
          >
            <Mail className="h-4 w-4" />
            {BRAND.contacts.secondary}
          </a>
          <a
            href={`tel:${BRAND.contacts.mobile}`}
            className="flex items-center gap-3 text-sm text-white/45 transition-colors hover:text-cyan-300"
          >
            <Phone className="h-4 w-4" />
            {BRAND.contacts.mobile}
          </a>
        </div>
      </section>

      {/* Three disciplines, one vision — 33-box matrix */}
      <section className="mx-auto mt-28 max-w-6xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-white/80 sm:text-3xl animate-fade-in-delay-1 text-glow cursor-default">
          Three disciplines, one vision
        </h2>
        <p className="mb-10 text-center text-sm text-white/35">
          33 skill nodes across 3 domains
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {DISCIPLINES.map((disc, di) => {
            const Icon = disc.icon;
            return (
              <GlassPanel
                key={disc.label}
                data-reveal
                className={`reveal card-hover-lift p-8 hover:bg-white/[0.06]`}
              >
                <Icon
                  className={`mb-5 h-9 w-9 ${
                    di === 0 ? 'text-cyan-400' : di === 1 ? 'text-blue-400' : 'text-violet-400'
                  }`}
                />
                <h3 className="text-xl font-semibold text-white text-glow cursor-default">
                  {disc.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {disc.desc}
                </p>

                {/* 11-box sub-grid per discipline = 33 total */}
                <div className="mt-6 grid grid-cols-11 gap-1.5">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div
                      key={i}
                      className={`discipline-box ${disc.boxClass} aspect-square rounded-[4px] border border-white/10 bg-white/[0.03]`}
                      style={{ animationDelay: `${di * 11 + i * 30}ms` }}
                    />
                  ))}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mx-auto mt-28 max-w-4xl">
        <GlassPanel data-reveal className="reveal flex flex-col items-center gap-6 p-10 text-center md:p-14">
          <h2 className="text-glow cursor-default text-2xl font-bold text-white sm:text-3xl">
            Want to get in touch?
          </h2>
          <p className="max-w-xl text-glow cursor-default leading-relaxed text-white/50">
            Reach out through any of the contact channels below, or drop a message directly
            through the message box.
          </p>
          <button
            onClick={() => navigate('/message')}
            className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-8 py-3.5 font-medium text-cyan-100 backdrop-blur-xl transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,153,255,0.2)]"
          >
            Open Message Box
          </button>
        </GlassPanel>
      </section>

      <div className="mt-20 flex justify-center">
        <ArrowDown className="h-5 w-5 animate-bounce text-white/20" />
      </div>
    </div>
  );
}
