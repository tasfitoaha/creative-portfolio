import { useState, useCallback } from 'react';
import GlassPanel from '@/components/GlassPanel';
import { TrendingUp, Play, AlertCircle } from 'lucide-react';

interface CollatzResult {
  sequence: number[];
  steps: number;
  peak: number;
}

export default function CollatzVisualizer() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CollatzResult | null>(null);
  const [error, setError] = useState('');

  const trace = useCallback(() => {
    const raw = input.trim();
    if (!raw) {
      setError('Please enter a positive integer.');
      setResult(null);
      return;
    }

    if (!/^\d+$/.test(raw)) {
      setError('Invalid input. Only positive whole numbers are accepted.');
      setResult(null);
      return;
    }

    const n = parseInt(raw, 10);
    if (n < 1) {
      setError('Starting integer must be at least 1.');
      setResult(null);
      return;
    }

    if (n > 100000000) {
      setError('Input too large. Please enter a value up to 100,000,000.');
      setResult(null);
      return;
    }

    setError('');
    const seq: number[] = [n];
    let current = n;
    let peak = n;

    // Safety limit to avoid infinite loops from unexpected edge cases
    const maxIter = 2000;
    let iter = 0;

    while (current !== 1 && iter < maxIter) {
      if (current % 2 === 0) {
        current = current / 2;
      } else {
        current = 3 * current + 1;
      }
      seq.push(current);
      if (current > peak) peak = current;
      iter++;
    }

    setResult({ sequence: seq, steps: seq.length - 1, peak });
  }, [input]);

  // Build SVG chart
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = 40;

  let svgPath = '';
  let svgPoints: { x: number; y: number; val: number }[] = [];

  if (result && result.sequence.length > 1) {
    const maxVal = result.peak;
    const minVal = 1;
    const range = maxVal - minVal || 1;
    const stepCount = result.sequence.length;

    svgPoints = result.sequence.map((val, i) => ({
      x: padding + (i / (stepCount - 1)) * (chartWidth - padding * 2),
      y: chartHeight - padding - ((val - minVal) / range) * (chartHeight - padding * 2),
      val,
    }));

    svgPath = svgPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  }

  return (
    <div className="space-y-5">
      <GlassPanel className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="collatz-input" className="mb-2 block text-sm font-medium text-white/70">
              Enter Starting Integer
            </label>
            <input
              id="collatz-input"
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') trace();
              }}
              placeholder="e.g. 27 or 97"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-white placeholder-white/30 outline-none transition-all focus:border-cyan-400/40 focus:bg-white/[0.07]"
            />
          </div>
          <button
            onClick={trace}
            className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 font-medium text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,153,255,0.2)]"
          >
            <Play className="h-4 w-4" />
            Trace Trajectory
          </button>
        </div>
        <p className="mt-3 text-xs text-white/35">
          The Collatz conjecture: if n is even, divide by 2; if odd, compute 3n+1.
          Every positive integer tested so far eventually reaches 1.
        </p>
      </GlassPanel>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <span className="text-sm text-red-200">{error}</span>
        </div>
      )}

      {result && (
        <>
          {/* SVG Chart */}
          <GlassPanel className="overflow-hidden p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white/80">Trajectory Graph</h3>
            </div>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full"
                style={{ minWidth: 500 }}
              >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <line
                    key={t}
                    x1={padding}
                    y1={padding + t * (chartHeight - padding * 2)}
                    x2={chartWidth - padding}
                    y2={padding + t * (chartHeight - padding * 2)}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                  />
                ))}

                {/* Axes */}
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

                {/* Area under curve */}
                {svgPath && (
                  <path
                    d={`${svgPath} L ${(chartWidth - padding).toFixed(1)} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
                    fill="url(#collatzGradient)"
                    opacity={0.15}
                  />
                )}

                {/* Line path */}
                {svgPath && (
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(0,229,255,0.4))' }}
                  />
                )}

                {/* Peak point */}
                {svgPoints.length > 0 && (() => {
                  const peakPt = svgPoints.reduce((a, b) => (b.val > a.val ? b : a));
                  return (
                    <>
                      <circle cx={peakPt.x} cy={peakPt.y} r={4} fill="#3b82f6" style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' }} />
                      <text x={peakPt.x} y={peakPt.y - 10} fill="#60a5fa" fontSize={11} fontFamily="monospace" textAnchor="middle">
                        {peakPt.val.toLocaleString()}
                      </text>
                    </>
                  );
                })()}

                {/* End point (1) */}
                {svgPoints.length > 0 && (
                  <>
                    <circle cx={svgPoints[svgPoints.length - 1].x} cy={svgPoints[svgPoints.length - 1].y} r={3} fill="#22c55e" />
                    <text x={svgPoints[svgPoints.length - 1].x} y={svgPoints[svgPoints.length - 1].y + 18} fill="#4ade80" fontSize={10} fontFamily="monospace" textAnchor="middle">1</text>
                  </>
                )}

                <defs>
                  <linearGradient id="collatzGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </GlassPanel>

          {/* Summary metrics */}
          <div className="grid gap-4 sm:grid-cols-2">
            <GlassPanel className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">Total Iteration Steps to Terminate</p>
              <p className="mt-2 font-mono text-3xl font-bold text-cyan-300">{result.steps.toLocaleString()}</p>
            </GlassPanel>
            <GlassPanel className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">Highest Peak Value Reached</p>
              <p className="mt-2 font-mono text-3xl font-bold text-blue-300">{result.peak.toLocaleString()}</p>
            </GlassPanel>
          </div>

          {/* Sequence log */}
          <GlassPanel className="overflow-hidden">
            <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
              <h3 className="text-sm font-semibold text-white/80">Sequence Log</h3>
            </div>
            <div className="max-h-[200px] overflow-auto p-4">
              <div className="flex flex-wrap gap-2">
                {result.sequence.map((val, i) => (
                  <span
                    key={i}
                    className={`rounded-md border px-2.5 py-1 font-mono text-xs ${
                      val === result.peak
                        ? 'border-blue-400/30 bg-blue-500/10 text-blue-300'
                        : val === 1
                          ? 'border-green-400/30 bg-green-500/10 text-green-300'
                          : 'border-white/5 bg-white/[0.02] text-white/60'
                    }`}
                  >
                    {val.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          </GlassPanel>
        </>
      )}
    </div>
  );
}
