"use client";

import * as React from "react";

export interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
}

export function CurvedLoop({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
}: Readonly<CurvedLoopProps>) {
  const text = React.useMemo(() => {
    const hasTrailing = /\s| $/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + " ";
  }, [marqueeText]);

  const measureRef = React.useRef<SVGTextElement>(null);
  const textPathRef = React.useRef<SVGTextPathElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const [spacing, setSpacing] = React.useState(0);
  const [offset, setOffset] = React.useState(0);
  const uid = React.useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = React.useRef(false);
  const lastXRef = React.useRef(0);
  const dirRef = React.useRef<"left" | "right">(direction);
  const velRef = React.useRef(0);

  React.useLayoutEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  const ready = spacing > 0;
  const totalText = ready
    ? Array(Math.ceil(1800 / spacing) + 2)
        .fill(text)
        .join("")
    : text;

  React.useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text, className]);

  React.useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute("startOffset", initial + "px");
      setOffset(initial);
    }
  }, [spacing]);

  React.useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const currentOffset = parseFloat(
          textPathRef.current.getAttribute("startOffset") ?? "0",
        );
        let newOffset = currentOffset + delta;
        if (newOffset <= -spacing) newOffset += spacing;
        if (newOffset > 0) newOffset -= spacing;
        textPathRef.current.setAttribute("startOffset", newOffset + "px");
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(
      textPathRef.current.getAttribute("startOffset") ?? "0",
    );
    let newOffset = currentOffset + dx;
    if (newOffset <= -spacing) newOffset += spacing;
    if (newOffset > 0) newOffset -= spacing;
    textPathRef.current.setAttribute("startOffset", newOffset + "px");
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        visibility: ready ? "visible" : "hidden",
        cursor: interactive ? "grab" : "auto",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="block aspect-[100/12] w-full overflow-visible text-[6rem] leading-none font-bold uppercase select-none"
        viewBox="0 0 1440 120"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-white ${className ?? ""}`}>
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={offset + "px"}
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}
