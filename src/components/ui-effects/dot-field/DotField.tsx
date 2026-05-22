"use client";

import * as React from "react";

export interface DotFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "ref"> {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
}

const TWO_PI = Math.PI * 2;

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

export const DotField = React.memo(function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "rgba(168, 85, 247, 0.35)",
  gradientTo = "rgba(180, 151, 207, 0.25)",
  glowColor = "#120F17",
  className,
  style,
  ...rest
}: Readonly<DotFieldProps>) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const glowRef = React.useRef<SVGCircleElement>(null);
  const reactId = React.useId();
  const glowGradientId = `dot-field-glow-${reactId.replace(/:/g, "")}`;

  // Latest-props snapshot the animation loop reads each frame.
  const propsRef = React.useRef({
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
  });
  React.useLayoutEffect(() => {
    propsRef.current = {
      dotRadius,
      dotSpacing,
      cursorRadius,
      cursorForce,
      bulgeOnly,
      bulgeStrength,
      sparkle,
      waveAmplitude,
      gradientFrom,
      gradientTo,
    };
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const glowEl = glowRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const dots: Dot[] = [];
    const size = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
    let engagement = 0;
    let glowOpacity = 0;
    let frameCount = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const buildDots = (w: number, h: number) => {
      const p = propsRef.current;
      const step = p.dotRadius + p.dotSpacing;
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      dots.length = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          dots.push({ ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay });
        }
      }
    };

    const doResize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size.w = w;
      size.h = h;
      size.offsetX = rect.left + window.scrollX;
      size.offsetY = rect.top + window.scrollY;
      buildDots(w, h);
    };
    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 100);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.pageX - size.offsetX;
      mouse.y = e.pageY - size.offsetY;
    };

    const speedInterval = setInterval(() => {
      const dx = mouse.prevX - mouse.x;
      const dy = mouse.prevY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouse.speed += (dist - mouse.speed) * 0.5;
      if (mouse.speed < 0.001) mouse.speed = 0;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    }, 20);

    const tick = () => {
      frameCount++;
      const p = propsRef.current;
      const len = dots.length;
      const tAnim = frameCount * 0.02;

      const targetEngagement = Math.min(mouse.speed / 5, 1);
      engagement += (targetEngagement - engagement) * 0.06;
      if (engagement < 0.001) engagement = 0;

      glowOpacity += (engagement - glowOpacity) * 0.08;
      if (glowEl) {
        glowEl.setAttribute("cx", String(mouse.x));
        glowEl.setAttribute("cy", String(mouse.y));
        glowEl.style.opacity = String(glowOpacity);
      }

      ctx.clearRect(0, 0, size.w, size.h);
      const grad = ctx.createLinearGradient(0, 0, size.w, size.h);
      grad.addColorStop(0, p.gradientFrom);
      grad.addColorStop(1, p.gradientTo);
      ctx.fillStyle = grad;

      const cr = p.cursorRadius;
      const crSq = cr * cr;
      const rad = p.dotRadius / 2;
      const isBulge = p.bulgeOnly;

      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const d = dots[i];
        const dx = mouse.x - d.ax;
        const dy = mouse.y - d.ay;
        const distSq = dx * dx + dy * dy;

        if (distSq < crSq && engagement > 0.01) {
          const dist = Math.sqrt(distSq);
          if (isBulge) {
            const tFade = 1 - dist / cr;
            const push = tFade * tFade * p.bulgeStrength * engagement;
            const angle = Math.atan2(dy, dx);
            d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
            d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
          } else {
            const angle = Math.atan2(dy, dx);
            const move = (500 / dist) * (mouse.speed * p.cursorForce);
            d.vx += Math.cos(angle) * -move;
            d.vy += Math.sin(angle) * -move;
          }
        } else if (isBulge) {
          d.sx += (d.ax - d.sx) * 0.1;
          d.sy += (d.ay - d.sy) * 0.1;
        }

        if (!isBulge) {
          d.vx *= 0.9;
          d.vy *= 0.9;
          d.x = d.ax + d.vx;
          d.y = d.ay + d.vy;
          d.sx += (d.x - d.sx) * 0.1;
          d.sy += (d.y - d.sy) * 0.1;
        }

        let drawX = d.sx;
        let drawY = d.sy;
        if (p.waveAmplitude > 0) {
          drawY += Math.sin(d.ax * 0.03 + tAnim) * p.waveAmplitude;
          drawX += Math.cos(d.ay * 0.03 + tAnim * 0.7) * p.waveAmplitude * 0.5;
        }

        if (p.sparkle) {
          const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
          if (hash % 100 < 3) {
            ctx.moveTo(drawX + rad * 1.8, drawY);
            ctx.arc(drawX, drawY, rad * 1.8, 0, TWO_PI);
          } else {
            ctx.moveTo(drawX + rad, drawY);
            ctx.arc(drawX, drawY, rad, 0, TWO_PI);
          }
        } else {
          ctx.moveTo(drawX + rad, drawY);
          ctx.arc(drawX, drawY, rad, 0, TWO_PI);
        }
      }
      ctx.fill();
      raf = requestAnimationFrame(tick);
    };

    doResize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    let raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(speedInterval);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className ?? ""}`} style={style} {...rest}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          <radialGradient id={glowGradientId}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          ref={glowRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill={`url(#${glowGradientId})`}
          style={{ opacity: 0, willChange: "opacity" }}
        />
      </svg>
    </div>
  );
});
