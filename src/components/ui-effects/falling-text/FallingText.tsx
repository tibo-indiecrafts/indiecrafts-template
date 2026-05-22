"use client";

import Matter from "matter-js";
import * as React from "react";

export interface FallingTextProps {
  text?: string;
  highlightWords?: string[];
  trigger?: "auto" | "scroll" | "click" | "hover";
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
  className?: string;
  highlightClassName?: string;
}

export function FallingText({
  text = "",
  highlightWords = [],
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = "1rem",
  className,
  highlightClassName = "text-cyan-500 font-bold",
}: Readonly<FallingTextProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  // `auto` mode starts immediately; other triggers flip the flag from a
  // handler or IntersectionObserver below. Avoids setState-in-effect for auto.
  const [effectStarted, setEffectStarted] = React.useState(trigger === "auto");

  React.useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(" ");
    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        return `<span class="inline-block mx-[2px] select-none ${
          isHighlighted ? highlightClassName : ""
        }">${word}</span>`;
      })
      .join(" ");
    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords, highlightClassName]);

  React.useEffect(() => {
    if (trigger !== "scroll" || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEffectStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [trigger]);

  React.useEffect(() => {
    if (!effectStarted) return;
    const container = containerRef.current;
    const canvasContainer = canvasContainerRef.current;
    const textEl = textRef.current;
    if (!container || !canvasContainer || !textEl) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainer,
      engine,
      options: { width, height, background: backgroundColor, wireframes },
    });

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height,
      boundaryOptions,
    );
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

    const wordSpans = textEl.querySelectorAll("span");
    const wordBodies = Array.from(wordSpans).map((elem) => {
      const span = elem as HTMLSpanElement;
      const rect = span.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      return { elem: span, body };
    });

    for (const { elem, body } of wordBodies) {
      elem.style.position = "absolute";
      elem.style.left = `${body.position.x - (body.bounds.max.x - body.bounds.min.x) / 2}px`;
      elem.style.top = `${body.position.y - (body.bounds.max.y - body.bounds.min.y) / 2}px`;
      elem.style.transform = "none";
    }

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...wordBodies.map((wb) => wb.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    let raf = 0;
    const updateLoop = () => {
      for (const { body, elem } of wordBodies) {
        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      }
      raf = requestAnimationFrame(updateLoop);
    };
    raf = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(raf);
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas?.parentNode === canvasContainer) {
        canvasContainer.removeChild(render.canvas);
      }
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      // role/tabIndex/onKeyDown are only meaningful for the `click` trigger;
      // for other triggers the container is a plain visual region.
      role={trigger === "click" ? "button" : undefined}
      tabIndex={trigger === "click" ? 0 : undefined}
      onKeyDown={
        trigger === "click"
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTrigger();
              }
            }
          : undefined
      }
      className={`relative z-[1] h-full w-full cursor-pointer overflow-hidden pt-8 text-center ${className ?? ""}`}
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
    >
      <div ref={textRef} className="inline-block" style={{ fontSize, lineHeight: 1.4 }} />
      <div className="absolute top-0 left-0 z-0" ref={canvasContainerRef} />
    </div>
  );
}
