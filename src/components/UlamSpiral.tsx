import { useState, useRef, useCallback } from 'react';
import GlassPanel from '@/components/GlassPanel';
import { Sparkles, Loader2 } from 'lucide-react';

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  const limit = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export default function UlamSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maxNum, setMaxNum] = useState(5000);
  const [generating, setGenerating] = useState(false);
  const [primeCount, setPrimeCount] = useState(0);

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setGenerating(true);

    const size = 600;
    canvas.width = size;
    canvas.height = size;

    // Clear with dark background
    ctx.fillStyle = '#080812';
    ctx.fillRect(0, 0, size, size);

    // Compute pixel spacing from the spiral's maximum coordinate radius.
    // After n numbers the spiral extends ~ceil(sqrt(n))/2 steps from center.
    const maxCoord = Math.ceil(Math.sqrt(maxNum)) / 2;
    const radius = Math.floor(size / 2) - 2;
    const spacing = Math.min(4, Math.max(1, Math.floor(radius / maxCoord)));
    const pointSize = spacing >= 2 ? 2 : 1;
    const useGlow = maxNum <= 20000;

    const cx = Math.floor(size / 2);
    const cy = Math.floor(size / 2);
    let x = 0;
    let y = 0;
    let dx = 1;
    let dy = 0;
    let stepLen = 1;
    let stepCount = 0;
    let segCount = 0;
    let primes = 0;

    // Render asynchronously in chunks to avoid blocking
    const total = maxNum;
    let n = 1;

    const renderChunk = () => {
      const batchSize = 1000;
      const end = Math.min(n + batchSize, total + 1);

      for (; n <= end; n++) {
        if (isPrime(n)) {
          primes++;
          const px = cx + x * spacing;
          const py = cy + y * spacing;
          if (px >= 0 && px < size && py >= 0 && py < size) {
            ctx.fillStyle = '#00e5ff';
            if (useGlow) {
              ctx.shadowColor = '#00e5ff';
              ctx.shadowBlur = 4;
            }
            ctx.fillRect(
              px - (pointSize > 1 ? 1 : 0),
              py - (pointSize > 1 ? 1 : 0),
              pointSize,
              pointSize,
            );
            if (useGlow) ctx.shadowBlur = 0;
          }
        }

        x += dx;
        y += dy;
        stepCount++;

        if (stepCount === stepLen) {
          stepCount = 0;
          segCount++;
          // Turn clockwise: right -> up -> left -> down
          const temp = dx;
          dx = -dy;
          dy = temp;

          if (segCount % 2 === 0) {
            stepLen++;
          }
        }
      }

      setPrimeCount(primes);

      if (n <= total) {
        requestAnimationFrame(renderChunk);
      } else {
        setGenerating(false);
      }
    };

    requestAnimationFrame(renderChunk);
  }, [maxNum]);

  return (
    <div className="space-y-5">
      <GlassPanel className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label htmlFor="ulam-slider" className="mb-2 block text-sm font-medium text-white/70">
              Max Sequence Number: <span className="font-mono text-cyan-300">{maxNum.toLocaleString()}</span>
            </label>
            <input
              id="ulam-slider"
              type="range"
              min={100}
              max={100000}
              step={100}
              value={maxNum}
              onChange={(e) => setMaxNum(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400"
            />
            <div className="mt-1 flex justify-between text-xs text-white/30">
              <span>100</span>
              <span>100,000</span>
            </div>
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 font-medium text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,153,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Generating…</>
            ) : (
              <><Sparkles className="h-4 w-4" />Generate Spiral</>
            )}
          </button>
        </div>
      </GlassPanel>

      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-8">
        <GlassPanel className="overflow-hidden p-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="rounded-xl"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </GlassPanel>

        <div className="flex-1 space-y-4">
          <GlassPanel className="p-5">
            <h3 className="mb-2 text-sm font-semibold text-white/80">Ulam's Prime Spiral</h3>
            <p className="text-sm leading-relaxed text-white/50">
              Integers are arranged in a clockwise square spiral from the center. Prime
              numbers are plotted as glowing neon-cyan pixels, revealing the striking
              diagonal patterns first noticed by Stanislaw Ulam in 1963.
            </p>
          </GlassPanel>
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Primes found</span>
              <span className="font-mono text-lg font-bold text-cyan-300">{primeCount.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-white/50">Range scanned</span>
              <span className="font-mono text-sm text-white/70">1 – {maxNum.toLocaleString()}</span>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
