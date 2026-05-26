"use client";

import * as React from "react";

export interface MagnetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName,
  innerClassName,
  ...rest
}: Readonly<MagnetProps>) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  // Hot props for the mousemove handler.
  const propsRef = React.useRef({
    padding,
    disabled,
    magnetStrength,
    activeTransition,
    inactiveTransition,
  });
  React.useLayoutEffect(() => {
    propsRef.current = {
      padding,
      disabled,
      magnetStrength,
      activeTransition,
      inactiveTransition,
    };
  });

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    let isActive = false;

    const reset = () => {
      isActive = false;
      inner.style.transition = propsRef.current.inactiveTransition;
      inner.style.transform = "translate3d(0, 0, 0)";
    };

    const handleMouseMove = (e: MouseEvent) => {
      const p = propsRef.current;
      if (p.disabled) {
        if (isActive) reset();
        return;
      }
      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);
      if (distX < width / 2 + p.padding && distY < height / 2 + p.padding) {
        if (!isActive) {
          isActive = true;
          inner.style.transition = p.activeTransition;
        }
        const offsetX = (e.clientX - centerX) / p.magnetStrength;
        const offsetY = (e.clientY - centerY) / p.magnetStrength;
        inner.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      } else if (isActive) {
        reset();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // When `disabled` flips to true mid-life, snap back to origin.
  React.useEffect(() => {
    const inner = innerRef.current;
    if (!inner || !disabled) return;
    inner.style.transition = inactiveTransition;
    inner.style.transform = "translate3d(0, 0, 0)";
  }, [disabled, inactiveTransition]);

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...rest}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          transform: "translate3d(0, 0, 0)",
          transition: inactiveTransition,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
