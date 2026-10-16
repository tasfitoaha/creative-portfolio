import { useState, useRef, useCallback, useEffect } from 'react';
import GlassPanel from '@/components/GlassPanel';
import { Play, Pause, Volume2, Music } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  src: string;
}

const TRACKS: Track[] = [
  {
    id: 0,
    title: 'Algorithmic',
    src: 'https://drive.google.com/uc?export=download&id=1p31hTJ2GI2Ad6gg7zLoADE-OBJWQoFTM',
  },
  {
    id: 1,
    title: 'The Melancholic',
    src: 'https://drive.google.com/uc?export=download&id=1F_EilyW1gkaqd4lcRvnGZRrqFt8vKbSd',
  },
  {
    id: 2,
    title: 'Pads & Strings',
    src: 'https://drive.google.com/uc?export=download&id=1DJo5Sx-yvbGfI9M4bZtaas4B8h7-CrU7',
  },
];

export default function AudioDashboard() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadError, setLoadError] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setActiveTrack(null);
      audio.currentTime = 0;
    };
    const onError = () => {
      if (activeTrack !== null) {
        setLoadError(activeTrack);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const toggleTrack = useCallback(
    (trackId: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      setLoadError(null);

      if (activeTrack === trackId && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      if (activeTrack !== null && activeTrack !== trackId) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }

      if (activeTrack !== trackId) {
        audio.src = TRACKS[trackId].src;
        audio.currentTime = 0;
        setActiveTrack(trackId);
        setDuration(0);
        setCurrentTime(0);
      }

      audio.play().then(() => setIsPlaying(true)).catch(() => {
        setLoadError(trackId);
        setIsPlaying(false);
      });
    },
    [activeTrack, isPlaying],
  );

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <GlassPanel className="overflow-hidden">
      {/* Top panel */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4">
        <Music className="h-5 w-5 text-cyan-400" />
        <div>
          <h3 className="text-sm font-semibold text-white/85">Audio Experimentation</h3>
          <p className="text-xs text-white/40">Three exclusive ambient streams</p>
        </div>
      </div>

      {/* Track rows */}
      <div className="divide-y divide-white/5">
        {TRACKS.map((track) => {
          const isActive = activeTrack === track.id;
          const isThisPlaying = isActive && isPlaying;
          const isError = loadError === track.id;

          return (
            <div
              key={track.id}
              className={`flex items-center gap-4 px-5 py-4 transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-500/[0.06]'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              {/* Toggle node */}
              <button
                onClick={() => toggleTrack(track.id)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isThisPlaying
                    ? 'border-cyan-400/50 bg-cyan-500/20 shadow-[0_0_16px_rgba(0,153,255,0.3)]'
                    : isActive
                      ? 'border-cyan-400/30 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:border-cyan-400/20 hover:bg-cyan-500/[0.06]'
                }`}
                aria-label={isThisPlaying ? 'Pause' : 'Play'}
              >
                {isThisPlaying ? (
                  <Pause className="h-4 w-4 text-cyan-300" />
                ) : (
                  <Play className="h-4 w-4 translate-x-0.5 text-white/60" />
                )}
              </button>

              {/* Track info + pill badge */}
              <div className="flex flex-1 items-center justify-between gap-3">
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-cyan-200' : 'text-white/60'
                  }`}
                >
                  Track {track.id + 1}
                </span>
                <span
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200'
                      : 'border-white/10 bg-white/5 text-white/50'
                  }`}
                >
                  {track.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Playback bar */}
      {(activeTrack !== null || isPlaying) && (
        <div className="border-t border-white/10 bg-white/[0.02] px-5 py-3">
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 shrink-0 text-cyan-400/60" />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-mono text-xs text-white/40">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      )}

      {/* Error message */}
      {loadError !== null && (
        <div className="border-t border-amber-400/15 bg-amber-500/5 px-5 py-3">
          <p className="text-xs text-amber-200/70">
            Unable to load this track. The audio file may require direct access or may
            not be publicly streamable from its current host.
          </p>
        </div>
      )}
    </GlassPanel>
  );
}
