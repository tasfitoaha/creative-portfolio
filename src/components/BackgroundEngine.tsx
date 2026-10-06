import { useEffect, useRef, useMemo } from 'react';
import type { ReactElement } from 'react';

const BLOB_COLORS = [
  { r: 0, g: 102, b: 255 },
  { r: 0, g: 153, b: 255 },
  { r: 0, g: 204, b: 255 },
  { r: 26, g: 10, b: 62 },
  { r: 45, g: 27, b: 105 },
  { r: 58, g: 26, b: 142 },
  { r: 0, g: 68, b: 204 },
  { r: 74, g: 43, b: 168 },
];

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: { r: number; g: number; b: number };
  phase: number;
  speed: number;
  driftAmp: number;
}

function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let time = 0;
    const blobs: Blob[] = [];

    function init() {
      blobs.length = 0;
      const count = width < 768 ? 5 : 8;
      for (let i = 0; i < count; i++) {
        blobs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: Math.max(120, 180 + Math.random() * 260),
          color: BLOB_COLORS[i % BLOB_COLORS.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.0006 + Math.random() * 0.0012,
          driftAmp: 0.25 + Math.random() * 0.35,
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function frame() {
      time += 1;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(5, 5, 16, 0.035)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'screen';

      for (const blob of blobs) {
        blob.x += blob.vx + Math.sin(time * blob.speed + blob.phase) * blob.driftAmp;
        blob.y += blob.vy + Math.cos(time * blob.speed * 0.7 + blob.phase) * blob.driftAmp;

        const r = blob.radius;
        if (blob.x < -r) blob.x = width + r;
        if (blob.x > width + r) blob.x = -r;
        if (blob.y < -r) blob.y = height + r;
        if (blob.y > height + r) blob.y = -r;

        const c = blob.color;
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);
        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.22)`);
        grad.addColorStop(0.4, `rgba(${c.r},${c.g},${c.b},0.07)`);
        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ filter: 'blur(50px)', opacity: 0.65 }}
    />
  );
}

function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const size = 200;
    const cvs = document.createElement('canvas');
    cvs.width = size;
    cvs.height = size;
    const c = cvs.getContext('2d');
    if (!c) return;

    const img = c.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.floor(Math.random() * 3) / 2) * 255;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    c.putImageData(img, 0, 0);

    if (ref.current) {
      ref.current.style.backgroundImage = `url(${cvs.toDataURL()})`;
    }

    let offset = 0;
    const interval = setInterval(() => {
      offset += 1;
      if (ref.current) {
        ref.current.style.backgroundPosition = `${offset * 2}px ${offset * 5}px`;
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
        opacity: 0.12,
      }}
    />
  );
}

function PerspectiveRays() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (wrapRef.current) {
          wrapRef.current.style.transform = `translateY(${sy * 0.25}px)`;
        }
        if (svgRef.current) {
          const tilt = Math.sin(sy * 0.0008) * 2;
          svgRef.current.style.transform = `perspective(1200px) rotateX(${tilt}deg)`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const rays = useMemo(() => {
    const cx = 960;
    const cy = 540;
    const num = 36;
    const lines: ReactElement[] = [];
    for (let i = 0; i < num; i++) {
      const angle = (i / num) * Math.PI * 2;
      const len = 1400 + Math.random() * 500;
      const x2 = cx + Math.cos(angle) * len;
      const y2 = cy + Math.sin(angle) * len;
      const accent = i % 5 === 0;
      const op = accent ? 0.06 + Math.random() * 0.04 : 0.015 + Math.random() * 0.025;
      const col = accent ? '0,200,255' : '70,90,210';
      const w = accent ? 1.2 : 0.5;
      lines.push(
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={x2}
          y2={y2}
          stroke={`rgba(${col},${op})`}
          strokeWidth={w}
        />,
      );
    }
    return lines;
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        style={{ transition: 'transform 0.15s ease-out' }}
      >
        {rays}
      </svg>
    </div>
  );
}

export default function BackgroundEngine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: '#050510' }}
    >
      <FluidCanvas />
      <PerspectiveRays />
      <GrainOverlay />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(5,5,16,0.75) 100%)',
        }}
      />
    </div>
  );
}
