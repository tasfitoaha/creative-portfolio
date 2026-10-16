import { BRAND, type PageId } from '@/data/portfolio';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'writing', label: 'Writing' },
  { id: 'specialties', label: 'Specialties' },
  { id: 'info', label: 'Info' },
  { id: 'message', label: 'Message Box' },
];

export default function Header({ activePage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {BRAND.name}
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] ${
                  activePage === item.id
                    ? 'text-cyan-300'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <span className="absolute bottom-0 left-1/2 h-px w-6 -translate-x-1/2 bg-cyan-400 transition-opacity duration-200" />
                )}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white/60 transition-colors hover:text-white md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl md:hidden">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] ${
                  activePage === item.id
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
