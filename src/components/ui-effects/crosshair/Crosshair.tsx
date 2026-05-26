"use client";

import { gsap } from "gsap";
import * as React from "react";

export interface CrosshairProps {
  color?: string;
  /** Container to track. When omitted, the crosshair tracks the whole window. */
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

function getMousePos(e: MouseEvent, container?: HTMLElement | null) {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  }
  return { x: e.clientX, y: e.clientY };
}

export function Crosshair({
  color = "white",
  containerRef,
  className,
}: Readonly<CrosshairProps>) {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const lineHorizontalRef = React.useRef<HTMLDivElement>(null);
  const lineVerticalRef = React.useRef<HTMLDivElement>(null);
  const filterXRef = React.useRef<SVGFETurbulenceElement>(null);
  const filterYRef = React.useRef<SVGFETurbulenceElement>(null);
  const mouseRef = React.useRef({ x: 0, y: 0 });

  // Stable, per-instance ids so multiple Crosshair mounts don't fight over
  // the same SVG filter definitions.
  const reactId = React.useId();
  const fxId = `crosshair-fx-${reactId.replace(/:/g, "")}`;
  const fyId = `crosshair-fy-${reactId.replace(/:/g, "")}`;

  React.useEffect(() => {
    const container = containerRef?.current ?? null;
    const target: HTMLElement | Window = container ?? window;
    const lineH = lineHorizontalRef.current;
    const lineV = lineVerticalRef.current;
    if (!lineH || !lineV) return;

    const handleMouseMove = (ev: Event) => {
      const e = ev as MouseEvent;
      mouseRef.current = getMousePos(e, container);
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      const outside =
        e.clientX < bounds.left ||
        e.clientX > bounds.right ||
        e.clientY < bounds.top ||
        e.clientY > bounds.bottom;
      gsap.to([lineH, lineV], { opacity: outside ? 0 : 1 });
    };
    target.addEventListener("mousemove", handleMouseMove);

    const rendered = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
    };

    gsap.set([lineH, lineV], { opacity: 0 });

    let rafId = 0;
    const render = () => {
      rendered.tx.current = mouseRef.current.x;
      rendered.ty.current = mouseRef.current.y;
      rendered.tx.previous = lerp(
        rendered.tx.previous,
        rendered.tx.current,
        rendered.tx.amt,
      );
      rendered.ty.previous = lerp(
        rendered.ty.previous,
        rendered.ty.current,
        rendered.ty.amt,
      );
      gsap.set(lineV, { x: rendered.tx.previous });
      gsap.set(lineH, { y: rendered.ty.previous });
      rafId = requestAnimationFrame(render);
    };

    const startRender = () => {
      rendered.tx.previous = rendered.tx.current = mouseRef.current.x;
      rendered.ty.previous = rendered.ty.current = mouseRef.current.y;
      gsap.to([lineH, lineV], {
        duration: 0.9,
        ease: "Power3.easeOut",
        opacity: 1,
      });
      rafId = requestAnimationFrame(render);
      target.removeEventListener("mousemove", startRender);
    };
    target.addEventListener("mousemove", startRender);

    // Per-link enter/leave kicks a turbulence wobble through the SVG filter.
    const primitiveValues = { turbulence: 0 };
    const tl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          lineH.style.filter = `url(#${fxId})`;
          lineV.style.filter = `url(#${fyId})`;
        },
        onUpdate: () => {
          const s = primitiveValues.turbulence.toString();
          filterXRef.current?.setAttribute("baseFrequency", s);
          filterYRef.current?.setAttribute("baseFrequency", s);
        },
        onComplete: () => {
          lineH.style.filter = "none";
          lineV.style.filter = "none";
        },
      })
      .to(primitiveValues, {
        duration: 0.5,
        ease: "power1",
        startAt: { turbulence: 1 },
        turbulence: 0,
      });

    const enter = () => tl.restart();
    const leave = () => {
      tl.progress(1).kill();
    };
    const links = container
      ? container.querySelectorAll<HTMLAnchorElement>("a")
      : document.querySelectorAll<HTMLAnchorElement>("a");
    links.forEach((link) => {
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
    });

    return () => {
      cancelAnimationFrame(rafId);
      target.removeEventListener("mousemove", handleMouseMove);
      target.removeEventListener("mousemove", startRender);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
      });
      tl.kill();
    };
  }, [containerRef, fxId, fyId]);

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none top-0 left-0 z-[10000] h-full w-full ${containerRef ? "absolute" : "fixed"} ${className ?? ""}`}
    >
      <svg className="absolute top-0 left-0 h-full w-full">
        <defs>
          <filter id={fxId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves={1}
              ref={filterXRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id={fyId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves={1}
              ref={filterYRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        className="pointer-events-none absolute h-px w-full translate-y-1/2 opacity-0"
        style={{ background: color }}
      />
      <div
        ref={lineVerticalRef}
        className="pointer-events-none absolute h-full w-px translate-x-1/2 opacity-0"
        style={{ background: color }}
      />
    </div>
  );
}
