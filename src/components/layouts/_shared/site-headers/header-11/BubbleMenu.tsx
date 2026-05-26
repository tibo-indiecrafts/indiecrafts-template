"use client";

import { gsap } from "gsap";
import * as React from "react";

export type BubbleMenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export interface BubbleMenuProps {
  logo: React.ReactNode | string;
  items: BubbleMenuItem[];
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

const STYLES = `
.bubble-menu .menu-line {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}
.bubble-menu-items .pill-list .pill-col:nth-child(4):nth-last-child(2) {
  margin-left: calc(100% / 6);
}
.bubble-menu-items .pill-list .pill-col:nth-child(4):last-child {
  margin-left: calc(100% / 3);
}
@media (min-width: 900px) {
  .bubble-menu-items .pill-link { transform: rotate(var(--item-rot)); }
  .bubble-menu-items .pill-link:hover {
    transform: rotate(var(--item-rot)) scale(1.06);
    background: var(--hover-bg) !important;
    color: var(--hover-color) !important;
  }
  .bubble-menu-items .pill-link:active {
    transform: rotate(var(--item-rot)) scale(.94);
  }
}
@media (max-width: 899px) {
  .bubble-menu-items { padding-top: 120px; align-items: flex-start; }
  .bubble-menu-items .pill-list { row-gap: 16px; }
  .bubble-menu-items .pill-list .pill-col {
    flex: 0 0 100% !important;
    margin-left: 0 !important;
    overflow: visible;
  }
  .bubble-menu-items .pill-link {
    font-size: clamp(1.2rem, 3vw, 4rem);
    padding: clamp(1rem, 2vw, 2rem) 0;
    min-height: 80px !important;
  }
  .bubble-menu-items .pill-link:hover {
    transform: scale(1.06);
    background: var(--hover-bg);
    color: var(--hover-color);
  }
  .bubble-menu-items .pill-link:active { transform: scale(.94); }
}
`;

export function BubbleMenu({
  logo,
  items,
  onMenuClick,
  className,
  style,
  menuAriaLabel = "Toggle menu",
  menuBg = "#fff",
  menuContentColor = "#111",
  useFixedPosition = false,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12,
}: Readonly<BubbleMenuProps>) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const bubblesRef = React.useRef<HTMLAnchorElement[]>([]);
  const labelRefs = React.useRef<HTMLSpanElement[]>([]);

  const handleToggle = () => {
    const next = !isMenuOpen;
    if (next) setShowOverlay(true);
    setIsMenuOpen(next);
    onMenuClick?.(next);
  };

  React.useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });
      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: "power3.out",
            },
            "-=" + animationDuration * 0.9,
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power3.in",
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  React.useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) return;
      const bubbles = bubblesRef.current.filter(Boolean);
      const isDesktop = window.innerWidth >= 900;
      bubbles.forEach((bubble, i) => {
        const item = items[i];
        if (bubble && item) {
          gsap.set(bubble, { rotation: isDesktop ? (item.rotation ?? 0) : 0 });
        }
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, items]);

  const containerClassName = [
    "bubble-menu",
    useFixedPosition ? "fixed" : "absolute",
    "left-0 right-0 top-8 z-[1001] flex items-center justify-between gap-4 px-8",
    "pointer-events-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{STYLES}</style>

      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <div
          className="bubble logo-bubble pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)] will-change-transform md:h-14 md:px-8"
          aria-label="Logo"
          style={{ background: menuBg, minHeight: "48px" }}
        >
          <span className="logo-content inline-flex h-full w-[120px] items-center justify-center">
            {typeof logo === "string" ? (
              /* eslint-disable-next-line @next/next/no-img-element -- caller-provided logo URL; we don't know the dimensions upfront and the bubble sizes via CSS, so next/image's required width/height props don't fit. */
              <img
                src={logo}
                alt="Logo"
                className="bubble-logo block max-h-[60%] max-w-full object-contain"
              />
            ) : (
              logo
            )}
          </span>
        </div>

        <button
          type="button"
          className={[
            "bubble toggle-bubble menu-btn pointer-events-auto inline-flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full border-0 p-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)] will-change-transform md:h-14 md:w-14",
            isMenuOpen ? "open" : "",
          ].join(" ")}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span
            className="menu-line mx-auto block rounded-[2px]"
            style={{
              width: 26,
              height: 2,
              background: menuContentColor,
              transform: isMenuOpen ? "translateY(4px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="menu-line short mx-auto block rounded-[2px]"
            style={{
              marginTop: "6px",
              width: 26,
              height: 2,
              background: menuContentColor,
              transform: isMenuOpen ? "translateY(-4px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={[
            "bubble-menu-items pointer-events-none inset-0 z-[1000] flex items-center justify-center",
            useFixedPosition ? "fixed" : "absolute",
          ].join(" ")}
          aria-hidden={!isMenuOpen}
        >
          <ul
            className="pill-list pointer-events-auto m-0 mx-auto flex w-full max-w-[1600px] list-none flex-wrap gap-x-0 gap-y-1 px-6"
            role="menu"
            aria-label="Menu links"
          >
            {items.map((item, idx) => (
              <li
                key={idx}
                role="none"
                className="pill-col box-border flex [flex:0_0_calc(100%/3)] items-stretch justify-center"
              >
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel ?? item.label}
                  className="pill-link relative box-border flex w-full items-center justify-center overflow-hidden rounded-[999px] bg-white whitespace-nowrap text-inherit no-underline shadow-[0_4px_14px_rgba(0,0,0,0.10)] transition-[background,color] duration-300 ease-in-out"
                  style={
                    {
                      "--item-rot": `${item.rotation ?? 0}deg`,
                      "--pill-bg": menuBg,
                      "--pill-color": menuContentColor,
                      "--hover-bg": item.hoverStyles?.bgColor ?? "#f3f4f6",
                      "--hover-color": item.hoverStyles?.textColor ?? menuContentColor,
                      background: "var(--pill-bg)",
                      color: "var(--pill-color)",
                      minHeight: "var(--pill-min-h, 160px)",
                      padding: "clamp(1.5rem, 3vw, 8rem) 0",
                      fontSize: "clamp(1.5rem, 4vw, 4rem)",
                      fontWeight: 400,
                      lineHeight: 0,
                      willChange: "transform",
                      height: 10,
                    } as React.CSSProperties
                  }
                  ref={(el) => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label inline-block"
                    style={{
                      willChange: "transform, opacity",
                      height: "1.2em",
                      lineHeight: 1.2,
                    }}
                    ref={(el) => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
