import { useEffect, useState } from 'react';
import BackgroundEngine from '@/components/BackgroundEngine';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import WritingPage from '@/pages/WritingPage';
import SpecialtiesPage from '@/pages/SpecialtiesPage';
import InfoPage from '@/pages/InfoPage';
import MessagePage from '@/pages/MessagePage';
import PythagoreanTool from '@/pages/PythagoreanTool';
import type { PageId } from '@/data/portfolio';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500"
      style={{ width: `${progress}%` }}
    />
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.title = `Haniw Mejelin — ${activePage.charAt(0).toUpperCase() + activePage.slice(1)}`;
  }, [activePage]);

  return (
    <>
      <BackgroundEngine />
      <ScrollProgress />
      <Header activePage={activePage} onNavigate={handleNavigate} />

      <main className="relative z-10 min-h-screen">
        {activePage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {activePage === 'writing' && <WritingPage />}
        {activePage === 'specialties' && <SpecialtiesPage onNavigate={handleNavigate} />}
        {activePage === 'info' && <InfoPage />}
        {activePage === 'message' && <MessagePage />}
        {activePage === 'pythagorean' && <PythagoreanTool onNavigate={handleNavigate} />}
      </main>

      <footer className="relative z-10 border-t border-white/5 px-6 py-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-white/30">
            Haniw Mejelin — Vector layouts · Psychological literature · Script automation
          </p>
        </div>
      </footer>
    </>
  );
}
