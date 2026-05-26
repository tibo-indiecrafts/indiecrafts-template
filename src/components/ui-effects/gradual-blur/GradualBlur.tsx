"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type Animated = boolean | "scroll";

export interface GradualBlurProps {
  children?: React.ReactNode;
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: Animated;
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: Curve;
  responsive?: boolean;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;

  preset?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "subtle"
    | "intense"
    | "smooth"
    | "sharp"
    | "header"
    | "footer"
    | "sidebar"
    | "page-header"
    | "page-footer";
  hoverIntensity?: number;
  target?: "parent" | "page";

  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_CONFIG: Required<
  Pick<
    GradualBlurProps,
    | "position"
    | "strength"
    | "height"
    | "divCount"
    | "exponential"
    | "zIndex"
    | "animated"
    | "duration"
    | "easing"
    | "opacity"
    | "curve"
    | "responsive"
    | "target"
  >
> = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
};

const PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": {
    position: "top",
    height: "10rem",
    target: "page",
    strength: 3,
  },
  "page-footer": {
    position: "bottom",
    height: "10rem",
    target: "page",
    strength: 3,
  },
};

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const GRADIENT_DIRECTION: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

function useResponsiveDimension(
  responsive: boolean,
  base: string | undefined,
  mobile: string | undefined,
  tablet: string | undefined,
  desktop: string | undefined,
) {
  const subscribe = React.useCallback((cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);
  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return base;
    const w = window.innerWidth;
    if (w <= 480 && mobile) return mobile;
    if (w <= 768 && tablet) return tablet;
    if (w <= 1024 && desktop) return desktop;
    return base;
  }, [base, mobile, tablet, desktop]);
  const responsiveValue = React.useSyncExternalStore(subscribe, getSnapshot, () => base);
  return responsive ? responsiveValue : base;
}

function useIntersectionObserver(
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve: boolean,
) {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      if (!shouldObserve || !ref.current) return () => {};
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Latching: once intersected, stay true (matches upstream UX).
          if (entry.isIntersecting) cb();
        },
        { threshold: 0.1 },
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    },
    [ref, shouldObserve],
  );
  // Always return true once we've observed any intersection.
  const visibleRef = React.useRef(!shouldObserve);
  return React.useSyncExternalStore(
    (cb) =>
      subscribe(() => {
        visibleRef.current = true;
        cb();
      }),
    () => visibleRef.current,
    () => !shouldObserve,
  );
}

export function GradualBlur(props: Readonly<GradualBlurProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const config = React.useMemo(() => {
    const presetConfig =
      props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return { ...DEFAULT_CONFIG, ...presetConfig, ...props };
  }, [props]);

  const responsiveHeight = useResponsiveDimension(
    config.responsive,
    config.height,
    config.mobileHeight,
    config.tabletHeight,
    config.desktopHeight,
  );
  const responsiveWidth = useResponsiveDimension(
    config.responsive,
    config.width,
    config.mobileWidth,
    config.tabletWidth,
    config.desktopWidth,
  );

  const isVisible = useIntersectionObserver(containerRef, config.animated === "scroll");

  const blurDivs = React.useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / config.divCount;
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength;
    const curveFunc = CURVE_FUNCTIONS[config.curve] ?? CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= config.divCount; i++) {
      const progress = curveFunc(i / config.divCount);
      const blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * config.divCount + 1) * currentStrength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = GRADIENT_DIRECTION[config.position];
      const divStyle: React.CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      };
      divs.push(<div key={i} className="absolute inset-0" style={divStyle} />);
    }
    return divs;
  }, [config, isHovered]);

  const containerStyle = React.useMemo<React.CSSProperties>(() => {
    const isVertical = config.position === "top" || config.position === "bottom";
    const isPageTarget = config.target === "page";
    const base: React.CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated
        ? `opacity ${config.duration} ${config.easing}`
        : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    };
    if (isVertical) {
      base.height = responsiveHeight;
      base.width = responsiveWidth ?? "100%";
      base[config.position] = 0;
      base.left = 0;
      base.right = 0;
    } else {
      base.width = responsiveWidth ?? responsiveHeight;
      base.height = "100%";
      base[config.position] = 0;
      base.top = 0;
      base.bottom = 0;
    }
    return base;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  const { animated, onAnimationComplete, duration } = config;
  React.useEffect(() => {
    if (!(isVisible && animated === "scroll" && onAnimationComplete)) return;
    const t = setTimeout(() => onAnimationComplete(), parseFloat(duration) * 1000);
    return () => clearTimeout(t);
  }, [isVisible, animated, onAnimationComplete, duration]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate",
        config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent",
        config.className,
      )}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="relative h-full w-full">{blurDivs}</div>
      {props.children && <div className="relative">{props.children}</div>}
    </div>
  );
}
