"use client";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions, MoveDirection } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

/**
 * `@tsparticles`-based decorative dust-particle layer used by
 * `ui-illustrations/scan-illustration`. White circles linked by thin
 * lines drift slowly with random opacity. Sourced from the upstream
 * Tailark catalogue (`particles.tsx` shipped at the components root
 * for `bento-03`'s `ScanIllustration`); promoted here as a flat
 * `ui-effects/` decorative primitive so other consumers can mount it.
 */
export const LightDarkParticles = ({ id }: { id: string }) => {
  const [init, setInit] = useState(true);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (_container?: Container): Promise<void> => {
    void _container;
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fullScreen: { enable: false, zIndex: 10 },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: false, mode: "repulse" },
          resize: { enable: true },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        bounce: {
          horizontal: { value: 1 },
          vertical: { value: 1 },
        },
        collisions: {
          absorb: { speed: 2 },
          bounce: {
            horizontal: { value: 1 },
            vertical: { value: 1 },
          },
          enable: false,
          maxSpeed: 50,
          mode: "bounce",
          overlap: { enable: true, retries: 0 },
        },
        color: { value: "#ffffff" },
        move: {
          angle: { offset: 0, value: 90 },
          attract: {
            distance: 200,
            enable: false,
            rotate: { x: 3000, y: 3000 },
          },
          center: { x: 50, y: 50, mode: "percent", radius: 0 },
          decay: 0,
          direction: MoveDirection.none,
          drift: 0,
          enable: true,
          gravity: {
            acceleration: 9.81,
            enable: false,
            inverse: false,
            maxSpeed: 50,
          },
          path: {
            clamp: true,
            delay: { value: 0 },
            enable: false,
            options: {},
          },
          outModes: { default: "out" },
          random: false,
          size: false,
          speed: { min: 0.1, max: 1 },
          spin: { acceleration: 0, enable: false },
          straight: false,
          trail: { enable: false, length: 10, fill: {} },
          vibrate: false,
          warp: false,
        },
        number: {
          density: { enable: true, width: 400, height: 400 },
          limit: { mode: "delete", value: 0 },
          value: 120,
        },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: {
            count: 0,
            enable: true,
            speed: 4,
            decay: 0,
            delay: 0,
            sync: false,
            mode: "auto",
            startValue: "random",
            destroy: "none",
          },
        },
        shape: { close: true, fill: true, options: {}, type: "circle" },
        size: { value: { min: 0.25, max: 1.5 } },
        stroke: { width: 0.25 },
        zIndex: { value: 0, opacityRate: 1, sizeRate: 1, velocityRate: 1 },
        links: {
          blink: false,
          color: { value: "#ffffff" },
          consent: false,
          distance: 80,
          enable: true,
          frequency: 1,
          opacity: 0.4,
          shadow: { blur: 5, color: { value: "#000" }, enable: false },
          triangles: { enable: false, frequency: 1 },
          width: 0.5,
          warp: false,
          maxConnections: 2,
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        className="absolute inset-0 size-full"
        id={id}
        particlesLoaded={particlesLoaded}
        options={options}
      />
    );
  }

  return null;
};
