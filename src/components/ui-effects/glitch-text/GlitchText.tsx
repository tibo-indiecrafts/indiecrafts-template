"use client";

import * as React from "react";

import "./glitch-text.css";

export interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

// Custom CSS variables consumed by glitch-text.css.
type GlitchVars = {
  "--glitch-after-duration": string;
  "--glitch-before-duration": string;
  "--glitch-after-shadow": string;
  "--glitch-before-shadow": string;
};

export function GlitchText({
  children,
  speed = 0.5,
  enableShadows = true,
  enableOnHover = false,
  className,
}: Readonly<GlitchTextProps>) {
  const inlineStyles: React.CSSProperties & GlitchVars = {
    "--glitch-after-duration": `${speed * 3}s`,
    "--glitch-before-duration": `${speed * 2}s`,
    "--glitch-after-shadow": enableShadows ? "-5px 0 red" : "none",
    "--glitch-before-shadow": enableShadows ? "5px 0 cyan" : "none",
  };

  return (
    <div
      data-text={children}
      style={inlineStyles}
      className={`glitch-text mx-auto text-[clamp(2rem,10vw,8rem)] ${
        enableOnHover ? "glitch-text--hover" : ""
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
