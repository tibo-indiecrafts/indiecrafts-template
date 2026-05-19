"use client";

import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as React from "react";

import { cn } from "@/lib/utils";

import Model from "./Model";
import { useDimension } from "./use-dimension";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1704677982215-a2248af6009b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800&auto=format&fit=crop",
];

export interface ImageRippleProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: string[];
}

export function ImageRipple({
  images = DEFAULT_IMAGES,
  className,
  children,
  ...props
}: Readonly<ImageRippleProps>) {
  const device = useDimension();

  if (!device.width || !device.height) {
    return (
      <div
        className={cn("relative h-screen w-full bg-neutral-950 text-white", className)}
        {...props}
      />
    );
  }

  const frustumSize = device.height;
  const aspect = device.width / device.height;

  return (
    <div
      className={cn("relative h-screen w-full bg-neutral-950 text-white", className)}
      {...props}
    >
      <Canvas>
        <OrthographicCamera
          makeDefault
          args={[
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000,
          ]}
          position={[0, 0, 2]}
        />
        <React.Suspense fallback={null}>
          <Model images={images} />
        </React.Suspense>
      </Canvas>
      {children ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-14 text-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
