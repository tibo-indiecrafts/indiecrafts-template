"use client";

import gsap from "gsap";
import * as React from "react";

interface Gap {
  row: number;
  col: number;
}
interface Duration {
  enter: number;
  leave: number;
}

export interface CubesProps {
  gridSize?: number;
  cubeSize?: number;
  maxAngle?: number;
  radius?: number;
  easing?: gsap.EaseString;
  duration?: Duration;
  cellGap?: number | Gap;
  borderStyle?: string;
  faceColor?: string;
  shadow?: boolean | string;
  autoAnimate?: boolean;
  rippleOnClick?: boolean;
  rippleColor?: string;
  rippleSpeed?: number;
  className?: string;
}

export function Cubes({
  gridSize = 10,
  cubeSize,
  maxAngle = 45,
  radius = 3,
  easing = "power3.out",
  duration = { enter: 0.3, leave: 0.6 },
  cellGap,
  borderStyle = "1px solid #fff",
  faceColor = "#120F17",
  shadow = false,
  autoAnimate = true,
  rippleOnClick = true,
  rippleColor = "#fff",
  rippleSpeed = 2,
  className,
}: Readonly<CubesProps>) {
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const idleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const userActiveRef = React.useRef(false);
  const simPosRef = React.useRef({ x: 0, y: 0 });
  const simTargetRef = React.useRef({ x: 0, y: 0 });
  const simRAFRef = React.useRef<number | null>(null);

  // Hot props for the imperative DOM tilt/ripple loops; lets us keep the
  // pointer/touch effect at empty-deps so it doesn't tear listeners on every
  // prop change.
  const propsRef = React.useRef({
    radius,
    maxAngle,
    enterDur: duration.enter,
    leaveDur: duration.leave,
    easing,
    gridSize,
    rippleOnClick,
    rippleColor,
    rippleSpeed,
    faceColor,
  });
  React.useLayoutEffect(() => {
    propsRef.current = {
      radius,
      maxAngle,
      enterDur: duration.enter,
      leaveDur: duration.leave,
      easing,
      gridSize,
      rippleOnClick,
      rippleColor,
      rippleSpeed,
      faceColor,
    };
  });

  const colGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : (cellGap as Gap | undefined)?.col !== undefined
        ? `${(cellGap as Gap).col}px`
        : "5%";
  const rowGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : (cellGap as Gap | undefined)?.row !== undefined
        ? `${(cellGap as Gap).row}px`
        : "5%";

  React.useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const tiltAt = (rowCenter: number, colCenter: number) => {
      const p = propsRef.current;
      el.querySelectorAll<HTMLDivElement>(".cube").forEach((cube) => {
        const r = Number(cube.dataset.row);
        const c = Number(cube.dataset.col);
        const dist = Math.hypot(r - rowCenter, c - colCenter);
        if (dist <= p.radius) {
          const pct = 1 - dist / p.radius;
          const angle = pct * p.maxAngle;
          gsap.to(cube, {
            duration: p.enterDur,
            ease: p.easing,
            overwrite: true,
            rotateX: -angle,
            rotateY: angle,
          });
        } else {
          gsap.to(cube, {
            duration: p.leaveDur,
            ease: "power3.out",
            overwrite: true,
            rotateX: 0,
            rotateY: 0,
          });
        }
      });
    };

    const resetAll = () => {
      el.querySelectorAll<HTMLDivElement>(".cube").forEach((cube) =>
        gsap.to(cube, {
          duration: propsRef.current.leaveDur,
          rotateX: 0,
          rotateY: 0,
          ease: "power3.out",
        }),
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      const rect = el.getBoundingClientRect();
      const cellW = rect.width / propsRef.current.gridSize;
      const cellH = rect.height / propsRef.current.gridSize;
      const colCenter = (e.clientX - rect.left) / cellW;
      const rowCenter = (e.clientY - rect.top) / cellH;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));
      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      const rect = el.getBoundingClientRect();
      const cellW = rect.width / propsRef.current.gridSize;
      const cellH = rect.height / propsRef.current.gridSize;
      const touch = e.touches[0];
      const colCenter = (touch.clientX - rect.left) / cellW;
      const rowCenter = (touch.clientY - rect.top) / cellH;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));
      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    };

    const onTouchStart = () => {
      userActiveRef.current = true;
    };
    const onTouchEnd = () => resetAll();

    const onClick = (e: MouseEvent | TouchEvent) => {
      const p = propsRef.current;
      if (!p.rippleOnClick) return;
      const rect = el.getBoundingClientRect();
      const cellW = rect.width / p.gridSize;
      const cellH = rect.height / p.gridSize;
      const clientX =
        (e as MouseEvent).clientX ??
        ((e as TouchEvent).touches && (e as TouchEvent).touches[0]?.clientX);
      const clientY =
        (e as MouseEvent).clientY ??
        ((e as TouchEvent).touches && (e as TouchEvent).touches[0]?.clientY);
      if (clientX == null || clientY == null) return;
      const colHit = Math.floor((clientX - rect.left) / cellW);
      const rowHit = Math.floor((clientY - rect.top) / cellH);

      const baseRingDelay = 0.15;
      const baseAnimDur = 0.3;
      const baseHold = 0.6;
      const spreadDelay = baseRingDelay / p.rippleSpeed;
      const animDuration = baseAnimDur / p.rippleSpeed;
      const holdTime = baseHold / p.rippleSpeed;

      const rings: Record<number, HTMLDivElement[]> = {};
      el.querySelectorAll<HTMLDivElement>(".cube").forEach((cube) => {
        const r = Number(cube.dataset.row);
        const c = Number(cube.dataset.col);
        const dist = Math.hypot(r - rowHit, c - colHit);
        const ring = Math.round(dist);
        (rings[ring] ??= []).push(cube);
      });

      Object.keys(rings)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((ring) => {
          const delay = ring * spreadDelay;
          const faces = rings[ring].flatMap((cube) =>
            Array.from(cube.querySelectorAll<HTMLElement>(".cube-face")),
          );
          gsap.to(faces, {
            backgroundColor: p.rippleColor,
            duration: animDuration,
            delay,
            ease: "power3.out",
          });
          gsap.to(faces, {
            backgroundColor: p.faceColor,
            duration: animDuration,
            delay: delay + animDuration + holdTime,
            ease: "power3.out",
          });
        });
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", resetAll);
    el.addEventListener("click", onClick);
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    let cancelled = false;
    if (autoAnimate) {
      simPosRef.current = {
        x: Math.random() * propsRef.current.gridSize,
        y: Math.random() * propsRef.current.gridSize,
      };
      simTargetRef.current = {
        x: Math.random() * propsRef.current.gridSize,
        y: Math.random() * propsRef.current.gridSize,
      };
      const speed = 0.02;
      const loop = () => {
        if (cancelled) return;
        if (!userActiveRef.current) {
          const pos = simPosRef.current;
          const tgt = simTargetRef.current;
          pos.x += (tgt.x - pos.x) * speed;
          pos.y += (tgt.y - pos.y) * speed;
          tiltAt(pos.y, pos.x);
          if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
            simTargetRef.current = {
              x: Math.random() * propsRef.current.gridSize,
              y: Math.random() * propsRef.current.gridSize,
            };
          }
        }
        simRAFRef.current = requestAnimationFrame(loop);
      };
      simRAFRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelled = true;
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", resetAll);
      el.removeEventListener("click", onClick);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (simRAFRef.current != null) cancelAnimationFrame(simRAFRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [autoAnimate]);

  const cells = Array.from({ length: gridSize });
  const sceneStyle: React.CSSProperties = {
    gridTemplateColumns: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    columnGap: colGap,
    rowGap: rowGap,
    perspective: "99999999px",
    gridAutoRows: "1fr",
  };
  const wrapperStyle = {
    "--cube-face-border": borderStyle,
    "--cube-face-bg": faceColor,
    "--cube-face-shadow": shadow === true ? "0 0 6px rgba(0,0,0,.5)" : shadow || "none",
    ...(cubeSize
      ? {
          width: `${gridSize * cubeSize}px`,
          height: `${gridSize * cubeSize}px`,
        }
      : {}),
  } as React.CSSProperties;

  return (
    <div
      className={`relative aspect-square w-1/2 max-md:w-11/12 ${className ?? ""}`}
      style={wrapperStyle}
    >
      <div ref={sceneRef} className="grid h-full w-full" style={sceneStyle}>
        {cells.map((_, r) =>
          cells.map((__, c) => (
            <div
              key={`${r}-${c}`}
              className="cube relative aspect-square h-full w-full [transform-style:preserve-3d]"
              data-row={r}
              data-col={c}
            >
              <span className="pointer-events-none absolute -inset-9" />
              {[
                "translateY(-50%) rotateX(90deg)",
                "translateY(50%) rotateX(-90deg)",
                "translateX(-50%) rotateY(-90deg)",
                "translateX(50%) rotateY(90deg)",
                "rotateY(-90deg) translateX(50%) rotateY(90deg)",
                "rotateY(90deg) translateX(-50%) rotateY(-90deg)",
              ].map((transform, i) => (
                <div
                  key={i}
                  className="cube-face absolute inset-0 flex items-center justify-center"
                  style={{
                    background: "var(--cube-face-bg)",
                    border: "var(--cube-face-border)",
                    boxShadow: "var(--cube-face-shadow)",
                    transform,
                  }}
                />
              ))}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
