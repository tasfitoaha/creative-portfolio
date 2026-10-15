import { useState, useRef, useEffect, useCallback } from 'react';
import GlassPanel from '@/components/GlassPanel';
import { C_SOURCE_CODE } from '@/data/cSource';
import {
  ArrowLeft,
  Play,
  Square,
  Copy,
  Check,
  Download,
  Loader2,
  Search,
  Code2,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Calculator,
} from 'lucide-react';
import type { PageId } from '@/data/portfolio';

interface PythagoreanToolProps {
  onNavigate: (page: PageId) => void;
}

type Tab = 'calculator' | 'c-code' | 'how-it-works';
type SearchStatus = 'idle' | 'searching' | 'done' | 'stopped' | 'error';

interface ThreeSolution {
  a: number;
  b: number;
  c: number;
}

interface FourSolution {
  a: number;
  b: number;
  c: number;
  d: number;
}

export default function PythagoreanTool({ onNavigate }: PythagoreanToolProps) {
  const [tab, setTab] = useState<Tab>('calculator');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressCurrent, setProgressCurrent] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [threeSolutions, setThreeSolutions] = useState<ThreeSolution[]>([]);
  const [fourSolutions, setFourSolutions] = useState<FourSolution[]>([]);
  const [copiedResults, setCopiedResults] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const handleStart = useCallback(() => {
    const raw = input.trim();
    if (!raw) {
      setStatus('error');
      setErrorMsg('Please enter a whole number.');
      return;
    }

    if (!/^-?\d+$/.test(raw)) {
      setStatus('error');
      setErrorMsg(
        'Invalid input. Only whole numbers (positive or negative) are accepted. Fractions and decimals are not allowed.',
      );
      return;
    }

    const n = Math.abs(parseInt(raw, 10));
    if (n === 0) {
      setStatus('error');
      setErrorMsg('n must be at least 1 after taking the absolute value.');
      return;
    }

    if (n > 100000) {
      setStatus('error');
      setErrorMsg(
        'Extremely large searches may take a very long time. Please enter a value up to 100000.',
      );
      return;
    }

    setThreeSolutions([]);
    setFourSolutions([]);
    setProgress(0);
    setProgressCurrent(0);
    setProgressTotal(n);
    setStatus('searching');
    setErrorMsg('');

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const worker = new Worker(
      new URL('../workers/pythagorean.worker.ts', import.meta.url),
      { type: 'module' },
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const data = e.data;
      if (data.type === 'progress') {
        setProgressCurrent(data.current);
        setProgressTotal(data.total);
        setProgress((data.current / data.total) * 100);
      } else if (data.type === 'solution') {
        if (data.kind === 'three') {
          setThreeSolutions((prev) => [
            ...prev,
            { a: data.values[0], b: data.values[1], c: data.values[2] },
          ]);
        } else {
          setFourSolutions((prev) => [
            ...prev,
            {
              a: data.values[0],
              b: data.values[1],
              c: data.values[2],
              d: data.values[3],
            },
          ]);
        }
      } else if (data.type === 'done') {
        if (data.cancelled) {
          setStatus('stopped');
        } else {
          setStatus('done');
        }
        worker.terminate();
        workerRef.current = null;
      }
    };

    worker.onerror = () => {
      setStatus('error');
      setErrorMsg('An unexpected error occurred during the search.');
      worker.terminate();
      workerRef.current = null;
    };

    worker.postMessage({ type: 'start', n });
  }, [input]);

  const handleStop = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' });
    }
  }, []);

  const formatResultsText = useCallback(() => {
    let text = `=== Pythagorean Relation Finder — Results ===\n`;
    text += `n = ${Math.abs(parseInt(input, 10) || 0)}\n`;
    text += `Status: ${status === 'done' ? 'Complete' : 'Stopped'}\n\n`;

    text += `--- Three-square relations (a² + b² = c²) ---\n`;
    text += `Count: ${threeSolutions.length}\n`;
    for (const s of threeSolutions) {
      text += `  ${s.a}² + ${s.b}² = ${s.c}²\n`;
    }

    text += `\n--- Four-square relations (a² + b² + c² = d²) ---\n`;
    text += `Count: ${fourSolutions.length}\n`;
    for (const s of fourSolutions) {
      text += `  ${s.a}² + ${s.b}² + ${s.c}² = ${s.d}²\n`;
    }

    return text;
  }, [input, status, threeSolutions, fourSolutions]);

  const handleCopyResults = useCallback(() => {
    navigator.clipboard.writeText(formatResultsText());
    setCopiedResults(true);
    setTimeout(() => setCopiedResults(false), 2000);
  }, [formatResultsText]);

  const handleDownloadResults = useCallback(() => {
    const blob = new Blob([formatResultsText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pythagorean_results.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [formatResultsText]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(C_SOURCE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }, []);

  const handleDownloadC = useCallback(() => {
    const blob = new Blob([C_SOURCE_CODE], { type: 'text/x-csrc' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pythagorean_finder.c';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const cLines = C_SOURCE_CODE.split('\n');

  const tabConfig: { id: Tab; label: string; icon: typeof Search }[] = [
    { id: 'calculator', label: 'Calculator', icon: Search },
    { id: 'c-code', label: 'Raw C Code', icon: Code2 },
    { id: 'how-it-works', label: 'How It Works', icon: BookOpen },
  ];

  const isSearching = status === 'searching';
  const hasResults = threeSolutions.length > 0 || fourSolutions.length > 0;

  return (
    <div className="px-6 pb-20 pt-32">
      <section className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => onNavigate('specialties')}
          className="mb-6 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Specialties
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <Calculator className="h-7 w-7 text-cyan-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pythagorean Relation Finder
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-white/50">
            A tool that searches for integer relationships between perfect squares.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-white/10">
          {tabConfig.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'text-cyan-300'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {tab === t.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Calculator tab */}
        {tab === 'calculator' && (
          <div className="space-y-6">
            {/* Input panel */}
            <GlassPanel className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="n-input"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Maximum value (n)
                  </label>
                  <input
                    id="n-input"
                    type="text"
                    inputMode="numeric"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSearching) handleStart();
                    }}
                    disabled={isSearching}
                    placeholder="e.g. 100 or 1000"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-white placeholder-white/30 outline-none transition-all focus:border-cyan-400/40 focus:bg-white/[0.07] disabled:opacity-50"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleStart}
                    disabled={isSearching}
                    className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 font-medium text-cyan-100 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,153,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching…
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Search
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleStop}
                    disabled={!isSearching}
                    className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-medium text-red-200 backdrop-blur-xl transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Square className="h-4 w-4" />
                    Stop
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-white/35">
                Accepts positive or negative whole numbers (absolute value is used).
                Fractions, decimals, and non-numeric text are rejected. Extremely large
                searches may take a long time.
              </p>
            </GlassPanel>

            {/* Status messages */}
            {status === 'error' && (
              <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <span className="text-sm text-red-200">{errorMsg}</span>
              </div>
            )}

            {status === 'done' && (
              <div className="flex items-start gap-3 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                <span className="text-sm text-green-200">
                  Search complete. Found {threeSolutions.length} three-square and{' '}
                  {fourSolutions.length} four-square relations for n ={' '}
                  {Math.abs(parseInt(input, 10) || 0)}.
                </span>
              </div>
            )}

            {status === 'stopped' && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <span className="text-sm text-amber-200">
                  Search was stopped. Partial results shown below — this is not a complete
                  search. Found {threeSolutions.length} three-square and{' '}
                  {fourSolutions.length} four-square relations so far.
                </span>
              </div>
            )}

            {/* Progress bar */}
            {isSearching && (
              <GlassPanel className="p-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-white/60">
                    Progress: checking c = {progressCurrent} / {progressTotal}
                  </span>
                  <span className="font-mono text-cyan-300">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-3 flex gap-6 text-sm">
                  <span className="text-white/50">
                    Three-square: <span className="text-cyan-300">{threeSolutions.length}</span>
                  </span>
                  <span className="text-white/50">
                    Four-square: <span className="text-cyan-300">{fourSolutions.length}</span>
                  </span>
                </div>
              </GlassPanel>
            )}

            {/* Action buttons for results */}
            {hasResults && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyResults}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 backdrop-blur-xl transition-all hover:border-white/20 hover:text-white"
                >
                  {copiedResults ? (
                    <>
                      <Check className="h-4 w-4 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Results
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadResults}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 backdrop-blur-xl transition-all hover:border-white/20 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Download Results
                </button>
              </div>
            )}

            {/* Results */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Three-square results */}
              <GlassPanel className="overflow-hidden">
                <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                  <h3 className="text-sm font-semibold text-white/80">
                    Three-square relations
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-cyan-400/60">
                    a² + b² = c²
                  </p>
                </div>
                <div className="max-h-[400px] overflow-auto p-4">
                  {threeSolutions.length === 0 ? (
                    <p className="py-8 text-center text-sm text-white/30">
                      No three-square relations found yet.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {threeSolutions.map((s, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 font-mono text-xs text-white/70 transition-colors hover:border-cyan-400/15 hover:bg-cyan-500/[0.04]"
                        >
                          <span className="text-cyan-300">{s.a}</span>² +
                          <span className="text-cyan-300"> {s.b}</span>² =
                          <span className="text-blue-300"> {s.c}</span>²
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlassPanel>

              {/* Four-square results */}
              <GlassPanel className="overflow-hidden">
                <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                  <h3 className="text-sm font-semibold text-white/80">
                    Four-square relations
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-blue-400/60">
                    a² + b² + c² = d²
                  </p>
                </div>
                <div className="max-h-[400px] overflow-auto p-4">
                  {fourSolutions.length === 0 ? (
                    <p className="py-8 text-center text-sm text-white/30">
                      No four-square relations found yet.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {fourSolutions.map((s, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 font-mono text-xs text-white/70 transition-colors hover:border-blue-400/15 hover:bg-blue-500/[0.04]"
                        >
                          <span className="text-cyan-300">{s.a}</span>² +
                          <span className="text-cyan-300"> {s.b}</span>² +
                          <span className="text-cyan-300"> {s.c}</span>² =
                          <span className="text-blue-300"> {s.d}</span>²
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlassPanel>
            </div>
          </div>
        )}

        {/* Raw C Code tab */}
        {tab === 'c-code' && (
          <div className="space-y-4">
            <GlassPanel className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-sm text-white/70">
                    pythagorean_finder.c
                  </span>
                  <span className="ml-2 rounded border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-300">
                    C
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/80"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadC}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/80"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download .c
                  </button>
                </div>
              </div>
              <div className="max-h-[600px] overflow-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {cLines.map((line, i) => (
                      <tr key={i} className="leading-relaxed">
                        <td className="select-none border-r border-white/5 px-3 py-0 text-right font-mono text-xs text-white/20">
                          {i + 1}
                        </td>
                        <td className="px-4 py-0 font-mono text-xs text-white/70">
                          <pre className="whitespace-pre">{line || ' '}</pre>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
            <p className="text-xs text-white/35">
              This is the complete, compilable C source code. The in-browser calculator
              above runs a JavaScript implementation — the C code does not execute in your
              browser. To run the C version, compile it with{' '}
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-cyan-300/80">
                gcc -O2 -o pythagorean_finder pythagorean_finder.c -lm
              </code>
              .
            </p>
          </div>
        )}

        {/* How It Works tab */}
        {tab === 'how-it-works' && (
          <div className="space-y-6">
            <GlassPanel className="p-8">
              <h3 className="mb-4 text-xl font-semibold text-white">Algorithm</h3>
              <div className="space-y-4 text-sm leading-relaxed text-white/55">
                <p>
                  The tool searches for two kinds of integer relations between perfect
                  squares, up to a user-supplied maximum{' '}
                  <span className="font-mono text-cyan-300">n</span>. Every variable in
                  every relation must be a positive integer between 1 and{' '}
                  <span className="font-mono text-cyan-300">n</span>, inclusive.
                </p>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="mb-2 font-medium text-white/80">
                    Three-square relations: a² + b² = c²
                  </p>
                  <p className="text-white/50">
                    For each candidate{' '}
                    <span className="font-mono text-cyan-300">c</span> from 1 to n, we
                    iterate <span className="font-mono text-cyan-300">b</span> from 1 to{' '}
                    <span className="font-mono text-cyan-300">c</span>, compute{' '}
                    <span className="font-mono text-cyan-300">a² = c² − b²</span>, and
                    check whether the result is a perfect square. Variables are kept in
                    non-decreasing order (a ≤ b ≤ c) so each relation appears only once.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="mb-2 font-medium text-white/80">
                    Four-square relations: a² + b² + c² = d²
                  </p>
                  <p className="text-white/50">
                    For each candidate{' '}
                    <span className="font-mono text-cyan-300">d</span> from 1 to n, we
                    iterate <span className="font-mono text-cyan-300">c</span> from 1 to{' '}
                    <span className="font-mono text-cyan-300">d</span>, then{' '}
                    <span className="font-mono text-cyan-300">b</span> from 1 to{' '}
                    <span className="font-mono text-cyan-300">c</span>, compute{' '}
                    <span className="font-mono text-cyan-300">a² = d² − c² − b²</span>,
                    and check whether the result is a perfect square. Again, variables are
                    ordered (a ≤ b ≤ c ≤ d).
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-8">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Perfect-square test
              </h3>
              <p className="text-sm leading-relaxed text-white/55">
                Rather than comparing a floating-point square root to an integer (which can
                suffer from rounding errors), the tool computes{' '}
                <span className="font-mono text-cyan-300">floor(sqrt(x))</span>, then
                adjusts up or down by 1 to correct any rounding, and finally verifies{' '}
                <span className="font-mono text-cyan-300">s × s = x</span> using exact
                integer arithmetic. This guarantees no false positives or negatives.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Non-blocking execution
              </h3>
              <p className="text-sm leading-relaxed text-white/55">
                The in-browser calculator runs the search inside a Web Worker — a
                background thread separate from the main UI thread. This means the
                interface stays fully responsive while the search runs, results appear
                progressively as they are found, and the Stop button can cancel the search
                at any time. The status message honestly reports whether a search completed
                fully or was interrupted.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8">
              <h3 className="mb-4 text-xl font-semibold text-white">
                JavaScript vs C implementation
              </h3>
              <p className="text-sm leading-relaxed text-white/55">
                The calculator above uses a JavaScript implementation of the same algorithm
                that runs in your browser via a Web Worker. The Raw C Code tab shows the
                complete C source code that implements the identical logic. The C code does{' '}
                <strong className="text-white/70">not</strong> run in your browser — it is
                a real, compilable C program you can build and run locally with a C
                compiler. Both implementations share the same algorithm, perfect-square
                test, and variable-ordering rules.
              </p>
            </GlassPanel>
          </div>
        )}
      </section>
    </div>
  );
}
