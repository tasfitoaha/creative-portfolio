import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import BackgroundEngine from '@/components/BackgroundEngine';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import WritingPage from '@/pages/WritingPage';
import SpecialtiesPage from '@/pages/SpecialtiesPage';
import InfoPage from '@/pages/InfoPage';
import MessagePage from '@/pages/MessagePage';
import PythagoreanTool from '@/pages/PythagoreanTool';
import MathVisualizers from '@/pages/MathVisualizers';

function PageEffects() {
  const location = useLocation();

  useEffect(() => {
    const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1);
    document.title = `Haniw Mejelin — ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;

    document.querySelectorAll('audio').forEach((el) => {
      el.pause();
      el.currentTime = 0;
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <BackgroundEngine />
      <Header />
      <PageEffects />

      <main className="relative z-10 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/specialties" element={<SpecialtiesPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/pythagorean" element={<PythagoreanTool />} />
          <Route path="/mathviz" element={<MathVisualizers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
