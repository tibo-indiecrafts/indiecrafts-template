"use client";

import * as React from "react";

export interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
  className?: string;
}

const DEFAULT_COLORS = ["#2b4539", "#61dca3", "#61b3dc"];
const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789";

const FONT_SIZE = 16;
const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 20;

interface LetterCell {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const SHORTHAND_HEX_RE = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const FULL_HEX_RE = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

function hexToRgb(hex: string): Rgb | null {
  const expanded = hex.replace(SHORTHAND_HEX_RE, (_m, r, g, b) => r + r + g + g + b + b);
  const result = FULL_HEX_RE.exec(expanded);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function interpolateColor(start: Rgb, end: Rgb, factor: number): string {
  const r = Math.round(start.r + (end.r - start.r) * factor);
  const g = Math.round(start.g + (end.g - start.g) * factor);
  const b = Math.round(start.b + (end.b - start.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

export function LetterGlitch({
  glitchColors = DEFAULT_COLORS,
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = DEFAULT_CHARACTERS,
  className,
}: Readonly<LetterGlitchProps>) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // Stash hot props in refs so the (intentionally empty-deps) animation loop
  // can read the latest values without restarting the rAF chain on every
  // colors/characters change.
  const propsRef = React.useRef({ glitchColors, characters, smooth, glitchSpeed });
  React.useLayoutEffect(() => {
    propsRef.current = { glitchColors, characters, smooth, glitchSpeed };
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters: LetterCell[] = [];
    const grid = { columns: 0, rows: 0 };
    let lastGlitch = Date.now();
    let raf = 0;

    const getRandomChar = () => {
      const arr = Array.from(propsRef.current.characters);
      return arr[Math.floor(Math.random() * arr.length)];
    };
    const getRandomColor = () => {
      const cols = propsRef.current.glitchColors;
      return cols[Math.floor(Math.random() * cols.length)];
    };

    const initializeLetters = (columns: number, rows: number) => {
      grid.columns = columns;
      grid.rows = rows;
      const total = columns * rows;
      letters.length = 0;
      for (let i = 0; i < total; i++) {
        letters.push({
          char: getRandomChar(),
          color: getRandomColor(),
          targetColor: getRandomColor(),
          colorProgress: 1,
        });
      }
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = "top";
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const x = (i % grid.columns) * CHAR_WIDTH;
        const y = Math.floor(i / grid.columns) * CHAR_HEIGHT;
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, x, y);
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columns = Math.ceil(rect.width / CHAR_WIDTH);
      const rows = Math.ceil(rect.height / CHAR_HEIGHT);
      initializeLetters(columns, rows);
      draw();
    };

    const updateLetters = () => {
      if (letters.length === 0) return;
      const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
      for (let i = 0; i < updateCount; i++) {
        const idx = Math.floor(Math.random() * letters.length);
        const cell = letters[idx];
        if (!cell) continue;
        cell.char = getRandomChar();
        cell.targetColor = getRandomColor();
        if (!propsRef.current.smooth) {
          cell.color = cell.targetColor;
          cell.colorProgress = 1;
        } else {
          cell.colorProgress = 0;
        }
      }
    };

    const handleSmooth = () => {
      let needsRedraw = false;
      for (const letter of letters) {
        if (letter.colorProgress < 1) {
          letter.colorProgress = Math.min(1, letter.colorProgress + 0.05);
          const startRgb = hexToRgb(letter.color);
          const endRgb = hexToRgb(letter.targetColor);
          if (startRgb && endRgb) {
            letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
            needsRedraw = true;
          }
        }
      }
      if (needsRedraw) draw();
    };

    const tick = () => {
      const now = Date.now();
      if (now - lastGlitch >= propsRef.current.glitchSpeed) {
        updateLetters();
        draw();
        lastGlitch = now;
      }
      if (propsRef.current.smooth) handleSmooth();
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-black ${className ?? ""}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
      {outerVignette && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]" />
      )}
      {centerVignette && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]" />
      )}
    </div>
  );
}
