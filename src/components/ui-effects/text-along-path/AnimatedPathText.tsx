"use client";

import { useScroll, useTransform, type UseScrollOptions } from "motion/react";
import * as React from "react";

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";

export type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

export interface AnimatedPathTextProps {
  path: string;
  pathId?: string;
  pathClassName?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  svgClassName?: string;
  text: string;
  textClassName?: string;
  textAnchor?: "start" | "middle" | "end";
  animationType?: "auto" | "scroll";
  duration?: number;
  repeatCount?: number | "indefinite";
  easingFunction?: {
    calcMode?: string;
    keyTimes?: string;
    keySplines?: string;
  };
  scrollContainer?: React.RefObject<HTMLElement | null>;
  scrollOffset?: UseScrollOptions["offset"];
  scrollTransformValues?: [number, number];
}

export function AnimatedPathText({
  path,
  pathId,
  pathClassName,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  svgClassName,
  text,
  textClassName,
  textAnchor = "start",
  animationType = "auto",
  duration = 4,
  repeatCount = "indefinite",
  easingFunction,
  scrollContainer,
  scrollOffset = ["start end", "end end"],
  scrollTransformValues = [0, 100],
}: Readonly<AnimatedPathTextProps>) {
  // useId avoids the impure Math.random() in render path while still giving
  // a stable unique id per instance.
  const reactId = React.useId();
  const id = pathId ?? `animated-path-${reactId.replace(/:/g, "")}`;

  const textPathRefs = React.useRef<(SVGTextPathElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    ...(scrollContainer && { container: scrollContainer }),
    offset: scrollOffset,
  });
  const t = useTransform(scrollYProgress, [0, 1], scrollTransformValues);

  React.useEffect(() => {
    if (animationType !== "scroll") return;
    const handleChange = () => {
      const value = t.get();
      for (const node of textPathRefs.current) {
        node?.setAttribute("startOffset", `${value}%`);
      }
    };
    const unsubscribe = scrollYProgress.on("change", handleChange);
    return () => {
      unsubscribe();
    };
  }, [animationType, scrollYProgress, t]);

  const animationProps =
    animationType === "auto"
      ? {
          from: "0%",
          to: "100%",
          begin: "0s",
          dur: `${duration}s`,
          repeatCount,
          ...easingFunction,
        }
      : null;

  return (
    <svg
      className={svgClassName}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
    >
      <path
        id={id}
        className={pathClassName}
        d={path}
        stroke={showPath ? "currentColor" : "none"}
        fill="none"
      />

      <text textAnchor={textAnchor} fill="currentColor">
        <textPath
          className={textClassName}
          href={`#${id}`}
          startOffset="0%"
          ref={(node) => {
            textPathRefs.current[0] = node;
          }}
        >
          {animationType === "auto" && animationProps && (
            <animate attributeName="startOffset" {...animationProps} />
          )}
          {text}
        </textPath>
      </text>

      {animationType === "auto" && animationProps && (
        <text textAnchor={textAnchor} fill="currentColor">
          <textPath
            className={textClassName}
            href={`#${id}`}
            startOffset="-100%"
            ref={(node) => {
              textPathRefs.current[1] = node;
            }}
          >
            <animate
              attributeName="startOffset"
              {...animationProps}
              from="-100%"
              to="0%"
            />
            {text}
          </textPath>
        </text>
      )}
    </svg>
  );
}
