"use client";

import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useTransform,
} from "motion/react";
import * as React from "react";

type OrbitShape =
  | "ellipse"
  | "circle"
  | "square"
  | "rectangle"
  | "triangle"
  | "star"
  | "heart"
  | "infinity"
  | "wave"
  | "custom";

export interface OrbitImagesProps {
  images?: string[];
  altPrefix?: string;
  shape?: OrbitShape;
  customPath?: string;
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  starPoints?: number;
  starInnerRatio?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  direction?: "normal" | "reverse";
  fill?: boolean;
  width?: number | "100%";
  height?: number | "auto";
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  paused?: boolean;
  centerContent?: React.ReactNode;
  responsive?: boolean;
}

function genEllipse(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}
function genCircle(cx: number, cy: number, r: number) {
  return genEllipse(cx, cy, r, r);
}
function genSquare(cx: number, cy: number, size: number) {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}
function genRectangle(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}
function genTriangle(cx: number, cy: number, size: number) {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}
function genStar(cx: number, cy: number, outerR: number, innerR: number, points: number) {
  const step = Math.PI / points;
  let path = "";
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path + " Z";
}
function genHeart(cx: number, cy: number, size: number) {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}
function genInfinity(cx: number, cy: number, w: number, h: number) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}
function genWave(cx: number, cy: number, w: number, amplitude: number, waves: number) {
  const pts: string[] = [];
  const segs = waves * 20;
  const hw = w / 2;
  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }
  return pts.join(" ") + " Z";
}

interface OrbitItemProps {
  item: React.ReactNode;
  index: number;
  totalItems: number;
  path: string;
  itemSize: number;
  rotation: number;
  progress: MotionValue<number>;
  fill: boolean;
}

function OrbitItem({
  item,
  index,
  totalItems,
  path,
  itemSize,
  rotation,
  progress,
  fill,
}: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;
  const offsetDistance = useTransform(progress, (p: number) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });
  return (
    <motion.div
      className="absolute will-change-transform select-none"
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: "0deg",
        offsetAnchor: "center center",
        offsetDistance,
      }}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>{item}</div>
    </motion.div>
  );
}

export function OrbitImages({
  images = [],
  altPrefix = "Orbiting image",
  shape = "ellipse",
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = "normal",
  fill = true,
  width = 100,
  height = 100,
  className,
  showPath = false,
  pathColor = "rgba(0,0,0,0.1)",
  pathWidth = 2,
  easing = "linear",
  paused = false,
  centerContent,
  responsive = false,
}: Readonly<OrbitImagesProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  const cx = baseWidth / 2;
  const cy = baseWidth / 2;

  const path = React.useMemo(() => {
    switch (shape) {
      case "circle":
        return genCircle(cx, cy, radius);
      case "ellipse":
        return genEllipse(cx, cy, radiusX, radiusY);
      case "square":
        return genSquare(cx, cy, radius * 2);
      case "rectangle":
        return genRectangle(cx, cy, radiusX * 2, radiusY * 2);
      case "triangle":
        return genTriangle(cx, cy, radius * 2);
      case "star":
        return genStar(cx, cy, radius, radius * starInnerRatio, starPoints);
      case "heart":
        return genHeart(cx, cy, radius * 2);
      case "infinity":
        return genInfinity(cx, cy, radiusX * 2, radiusY * 2);
      case "wave":
        return genWave(cx, cy, radiusX * 2, radiusY, 3);
      case "custom":
        return customPath ?? genCircle(cx, cy, radius);
      default:
        return genEllipse(cx, cy, radiusX, radiusY);
    }
  }, [shape, customPath, cx, cy, radiusX, radiusY, radius, starPoints, starInnerRatio]);

  React.useEffect(() => {
    if (!responsive) return;
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / baseWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);
  React.useEffect(() => {
    if (paused) return;
    const controls = animate(progress, direction === "reverse" ? -100 : 100, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: "loop",
    });
    return () => controls.stop();
  }, [progress, duration, easing, direction, paused]);

  const containerWidth = responsive ? "100%" : typeof width === "number" ? width : "100%";
  const containerHeight = responsive
    ? "auto"
    : typeof height === "number"
      ? height
      : typeof width === "number"
        ? width
        : "auto";

  const items = images.map((src, index) => (
    /* eslint-disable-next-line @next/next/no-img-element -- arbitrary external image URLs in a decorative orbit; next/image's wrapper breaks the absolute/offset-path positioning. */
    <img
      key={src}
      src={src}
      alt={`${altPrefix} ${index + 1}`}
      draggable={false}
      className="h-full w-full object-contain"
    />
  ));

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto ${className ?? ""}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        aspectRatio: responsive ? "1 / 1" : undefined,
      }}
      aria-hidden="true"
    >
      <div
        className={responsive ? "absolute top-1/2 left-1/2" : "relative h-full w-full"}
        style={{
          width: responsive ? baseWidth : "100%",
          height: responsive ? baseWidth : "100%",
          transform: responsive ? `translate(-50%, -50%) scale(${scale})` : undefined,
          transformOrigin: "center center",
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="pointer-events-none absolute inset-0"
            >
              <path
                d={path}
                fill="none"
                stroke={pathColor}
                strokeWidth={pathWidth / (scale || 1)}
              />
            </svg>
          )}
          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
            />
          ))}
        </div>
      </div>
      {centerContent && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {centerContent}
        </div>
      )}
    </div>
  );
}
