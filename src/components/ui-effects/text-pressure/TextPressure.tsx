"use client";

import * as React from "react";

export interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

export function TextPressure({
  text = "Compressa",
  fontFamily = "Compressa VF",
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  strokeWidth = 2,
  className,
  minFontSize = 24,
}: Readonly<TextPressureProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const spansRef = React.useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = React.useRef({ x: 0, y: 0 });
  const cursorRef = React.useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = React.useState(minFontSize);
  const [scaleY, setScaleY] = React.useState(1);
  const [lineHeight, setLineHeight] = React.useState(1);

  const chars = React.useMemo(() => text.split(""), [text]);

  // Mirror animation-driving props into a ref so the rAF loop can stay
  // empty-deps and avoid restart churn when any boolean toggles.
  const flagsRef = React.useRef({ width, weight, italic, alpha });
  React.useLayoutEffect(() => {
    flagsRef.current = { width, weight, italic, alpha };
  });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = rect.left + rect.width / 2;
      mouseRef.current.y = rect.top + rect.height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const setSize = React.useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;
    const { width: containerW, height: containerH } =
      containerRef.current.getBoundingClientRect();
    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);
    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);
    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();
      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  React.useEffect(() => {
    setSize();
    let timeoutId: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setSize, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timeoutId);
    };
  }, [setSize]);

  React.useEffect(() => {
    let rafId = 0;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;
        const flags = flagsRef.current;

        for (const span of spansRef.current) {
          if (!span) continue;
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };
          const d = dist(mouseRef.current, charCenter);
          const wdth = flags.width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = flags.weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = flags.italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : "0";
          const alphaVal = flags.alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : "1";
          const newSetting = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          if (span.style.fontVariationSettings !== newSetting) {
            span.style.fontVariationSettings = newSetting;
          }
          if (flags.alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          } else if (!flags.alpha && span.style.opacity !== "") {
            span.style.opacity = "";
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const styleElement = React.useMemo(
    () => (
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .text-pressure-stroke span {
          position: relative;
          color: ${textColor};
        }
        .text-pressure-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>
    ),
    [fontFamily, fontUrl, textColor, strokeColor, strokeWidth],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-transparent"
    >
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${className ?? ""} ${
          flex ? "flex justify-between" : ""
        } ${stroke ? "text-pressure-stroke" : ""} text-center uppercase`}
        style={{
          fontFamily,
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            className="inline-block"
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
