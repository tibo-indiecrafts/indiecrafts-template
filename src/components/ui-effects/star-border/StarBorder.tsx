"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Polymorphic `as` prop needs `any` to satisfy the dynamic JSX type — TypeScript's polymorphic-component pattern with generics doesn't compose cleanly with React.ElementType here. */

import * as React from "react";

export type StarBorderProps<T extends React.ElementType = "button"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties["animationDuration"];
  thickness?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

// Keyframes + utility classes inlined via a <style> tag so the animation
// works in any environment (Storybook with Vite, Next.js with Turbopack,
// plain HTML) without needing the consumer to wire a CSS import or extend a
// Tailwind config. The selectors are namespaced (`star-border-*`) to avoid
// collisions with any other animations.
const STAR_BORDER_CSS = `
@keyframes star-border-bottom {
  0%   { transform: translate(0%, 0%);    opacity: 1; }
  100% { transform: translate(-100%, 0%); opacity: 0; }
}
@keyframes star-border-top {
  0%   { transform: translate(0%, 0%);   opacity: 1; }
  100% { transform: translate(100%, 0%); opacity: 0; }
}
.star-border-anim-bottom {
  animation: star-border-bottom 6s linear infinite alternate;
}
.star-border-anim-top {
  animation: star-border-top 6s linear infinite alternate;
}
`;

export function StarBorder<T extends React.ElementType = "button">({
  as,
  className,
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) {
  const Tag: any = as ?? "button";
  const restProps = rest as React.HTMLAttributes<HTMLElement> & {
    style?: React.CSSProperties;
  };
  const blobBackground = `radial-gradient(circle, ${color}, transparent 10%)`;

  return (
    <>
      <style>{STAR_BORDER_CSS}</style>
      <Tag
        className={`relative inline-block overflow-hidden rounded-[20px] ${className ?? ""}`}
        {...restProps}
        style={{
          padding: `${thickness}px 0`,
          ...restProps.style,
        }}
      >
        <div
          className="star-border-anim-bottom absolute right-[-250%] bottom-[-11px] z-0 h-[50%] w-[300%] rounded-full opacity-70"
          style={{ background: blobBackground, animationDuration: speed }}
        />
        <div
          className="star-border-anim-top absolute top-[-10px] left-[-250%] z-0 h-[50%] w-[300%] rounded-full opacity-70"
          style={{ background: blobBackground, animationDuration: speed }}
        />
        <div className="relative z-[1] rounded-[20px] border border-gray-800 bg-gradient-to-b from-black to-gray-900 px-[26px] py-[16px] text-center text-[16px] text-white">
          {children}
        </div>
      </Tag>
    </>
  );
}
