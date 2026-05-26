"use client";

import { gsap } from "gsap";
import * as React from "react";

export interface MagicBentoItem {
  color?: string;
  title: string;
  description: string;
  label: string;
}

export interface MagicBentoProps {
  items: MagicBentoItem[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;

function createParticleElement(x: number, y: number, color: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
}

function updateCardGlowProperties(
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
}

function subscribeResize(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeResize,
    () =>
      typeof window === "undefined" ? false : window.innerWidth <= MOBILE_BREAKPOINT,
    () => false,
  );
}

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableAnimations?: boolean;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

function ParticleCard({
  children,
  className = "",
  style,
  disableAnimations = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}: Readonly<ParticleCardProps>) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (disableAnimations) return;
    const element = cardRef.current;
    if (!element) return;

    const particlesActive: HTMLDivElement[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const memoizedParticles: HTMLDivElement[] = [];
    let particlesInitialized = false;
    let isHovered = false;
    let magnetismTween: gsap.core.Tween | null = null;

    const initializeParticles = () => {
      if (particlesInitialized) return;
      const { width, height } = element.getBoundingClientRect();
      for (let i = 0; i < particleCount; i++) {
        memoizedParticles.push(
          createParticleElement(Math.random() * width, Math.random() * height, glowColor),
        );
      }
      particlesInitialized = true;
    };

    const clearAllParticles = () => {
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
      magnetismTween?.kill();
      particlesActive.forEach((p) =>
        gsap.to(p, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "back.in(1.7)",
          onComplete: () => p.parentNode?.removeChild(p),
        }),
      );
      particlesActive.length = 0;
    };

    const animateParticles = () => {
      if (!isHovered) return;
      if (!particlesInitialized) initializeParticles();
      memoizedParticles.forEach((particle, index) => {
        const id = setTimeout(() => {
          if (!isHovered) return;
          const clone = particle.cloneNode(true) as HTMLDivElement;
          element.appendChild(clone);
          particlesActive.push(clone);
          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
          );
          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });
          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }, index * 100);
        timeouts.push(id);
      });
    };

    const handleMouseEnter = () => {
      isHovered = true;
      animateParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };
    const handleMouseLeave = () => {
      isHovered = false;
      clearAllParticles();
      if (enableTilt) {
        gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      }
      if (enableMagnetism) {
        gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      if (enableTilt) {
        gsap.to(element, {
          rotateX: ((y - cy) / cy) * -10,
          rotateY: ((x - cx) / cx) * 10,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        magnetismTween = gsap.to(element, {
          x: (x - cx) * 0.05,
          y: (y - cy) * 0.05,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
      element.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);
    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    disableAnimations,
    particleCount,
    glowColor,
    enableTilt,
    clickEffect,
    enableMagnetism,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}

interface GlobalSpotlightProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

function GlobalSpotlight({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: Readonly<GlobalSpotlightProps>) {
  React.useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    const proximity = spotlightRadius * 0.5;
    const fadeDistance = spotlightRadius * 0.75;

    const handleMouseMove = (e: MouseEvent) => {
      const grid = gridRef.current;
      if (!grid) return;
      const section = grid.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const inside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      const cards = grid.querySelectorAll<HTMLElement>(".card");
      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"));
        return;
      }
      let minDistance = Infinity;
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cx = cardRect.left + cardRect.width / 2;
        const cy = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - cx, e.clientY - cy) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effective = Math.max(0, distance);
        minDistance = Math.min(minDistance, effective);
        let glow = 0;
        if (effective <= proximity) glow = 1;
        else if (effective <= fadeDistance)
          glow = (fadeDistance - effective) / (fadeDistance - proximity);
        updateCardGlowProperties(card, e.clientX, e.clientY, glow, spotlightRadius);
      });
      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
      const target =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;
      gsap.to(spotlight, {
        opacity: target,
        duration: target > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };
    const handleMouseLeave = () => {
      gridRef.current
        ?.querySelectorAll<HTMLElement>(".card")
        .forEach((c) => c.style.setProperty("--glow-intensity", "0"));
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlight.parentNode?.removeChild(spotlight);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
  return null;
}

const STYLES = `
.bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
  --border-color: #2F293A;
  --background-dark: #120F17;
}
.card-responsive {
  grid-template-columns: 1fr;
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem;
}
@media (min-width: 600px) {
  .card-responsive { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .card-responsive { grid-template-columns: repeat(4, 1fr); }
  .card-responsive .card:nth-child(3) { grid-column: span 2; grid-row: span 2; }
  .card-responsive .card:nth-child(4) { grid-column: 1 / span 2; grid-row: 2 / span 2; }
  .card-responsive .card:nth-child(6) { grid-column: 4; grid-row: 3; }
}
.card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 6px;
  border-radius: inherit;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 1;
}
.particle::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  z-index: -1;
}
.text-clamp-1 {
  display: -webkit-box; -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; line-clamp: 1;
  overflow: hidden; text-overflow: ellipsis;
}
.text-clamp-2 {
  display: -webkit-box; -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; line-clamp: 2;
  overflow: hidden; text-overflow: ellipsis;
}
@media (max-width: 599px) {
  .card-responsive .card { width: 100%; min-height: 180px; }
}
`;

function borderGlowCss(glowColor: string) {
  return `
.card--border-glow::after {
  background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
    transparent 60%);
}
.card--border-glow:hover {
  box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
}
.particle::before { background: rgba(${glowColor}, 0.2); }
`;
}

export function MagicBento({
  items,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}: Readonly<MagicBentoProps>) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const shouldDisable = disableAnimations || isMobile;

  return (
    <>
      <style>{STYLES + borderGlowCss(glowColor)}</style>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisable}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div
        ref={gridRef}
        className="bento-section relative grid max-w-[54rem] gap-2 p-3 select-none"
        style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)" }}
      >
        <div className="card-responsive grid gap-2">
          {items.map((card, index) => {
            const baseClassName = `card relative flex aspect-[4/3] min-h-[200px] w-full max-w-full flex-col justify-between overflow-hidden rounded-[20px] border border-solid p-5 font-light transition-colors duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? "card--border-glow" : ""
            }`;
            const cardStyle = {
              backgroundColor: card.color ?? "var(--background-dark)",
              borderColor: "var(--border-color)",
              color: "#ffffff",
            } as React.CSSProperties;

            const content = (
              <>
                <div className="card__header relative flex justify-between gap-3 text-white">
                  <span className="card__label text-base">{card.label}</span>
                </div>
                <div className="card__content relative flex flex-col text-white">
                  <h3
                    className={`card__title m-0 mb-1 text-base font-normal ${textAutoHide ? "text-clamp-1" : ""}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`card__description text-xs leading-5 opacity-90 ${textAutoHide ? "text-clamp-2" : ""}`}
                  >
                    {card.description}
                  </p>
                </div>
              </>
            );

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisable}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {content}
                </ParticleCard>
              );
            }
            return (
              <div key={index} className={baseClassName} style={cardStyle}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
