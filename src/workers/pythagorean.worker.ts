/// <reference lib="webworker" />

interface SearchMessage {
  type: 'start' | 'stop';
  n?: number;
}

interface ResultMessage {
  type: 'progress';
  current: number;
  total: number;
}

interface SolutionMessage {
  type: 'solution';
  kind: 'three' | 'four';
  values: number[];
}

interface DoneMessage {
  type: 'done';
  cancelled: boolean;
  threeCount: number;
  fourCount: number;
}

type WorkerResponse = ResultMessage | SolutionMessage | DoneMessage;

let cancelled = false;

function isPerfectSquare(x: number): boolean {
  if (x < 0) return false;
  const s = Math.floor(Math.sqrt(x));
  return s * s === x;
}

function search(n: number): void {
  cancelled = false;
  let threeCount = 0;
  let fourCount = 0;
  const total = n;

  for (let c = 1; c <= n; c++) {
    if (cancelled) {
      const msg: DoneMessage = {
        type: 'done',
        cancelled: true,
        threeCount,
        fourCount,
      };
      (self as unknown as Worker).postMessage(msg);
      return;
    }

    const cSq = c * c;

    // Three-square: a^2 + b^2 = c^2, with 1 <= a <= b <= c
    for (let b = 1; b <= c; b++) {
      const bSq = b * b;
      const aSq = cSq - bSq;
      if (aSq < 1) break;
      const a = Math.floor(Math.sqrt(aSq));
      if (a * a === aSq && a >= 1 && a <= b) {
        threeCount++;
        const msg: SolutionMessage = {
          type: 'solution',
          kind: 'three',
          values: [a, b, c],
        };
        (self as unknown as Worker).postMessage(msg);
      }
    }

    // Four-square: a^2 + b^2 + c2^2 = d^2, with d = c here
    // Iterate b from 1..c, c2 from b..c, compute aSq = d^2 - b^2 - c2^2
    for (let c2 = 1; c2 <= c; c2++) {
      if (cancelled) break;
      const c2Sq = c2 * c2;
      const rem1 = cSq - c2Sq;
      if (rem1 < 2) break;

      for (let b = 1; b <= c2; b++) {
        const bSq = b * b;
        const aSq = rem1 - bSq;
        if (aSq < 1) break;
        const a = Math.floor(Math.sqrt(aSq));
        if (a * a === aSq && a >= 1 && a <= b) {
          fourCount++;
          const msg: SolutionMessage = {
            type: 'solution',
            kind: 'four',
            values: [a, b, c2, c],
          };
          (self as unknown as Worker).postMessage(msg);
        }
      }
    }

    const progressMsg: ResultMessage = {
      type: 'progress',
      current: c,
      total,
    };
    (self as unknown as Worker).postMessage(progressMsg);
  }

  const doneMsg: DoneMessage = {
    type: 'done',
    cancelled: false,
    threeCount,
    fourCount,
  };
  (self as unknown as Worker).postMessage(doneMsg);
}

(self as unknown as Worker).addEventListener(
  'message',
  (e: MessageEvent<SearchMessage>) => {
    const data = e.data;
    if (data.type === 'start' && typeof data.n === 'number') {
      search(data.n);
    } else if (data.type === 'stop') {
      cancelled = true;
    }
  },
);
