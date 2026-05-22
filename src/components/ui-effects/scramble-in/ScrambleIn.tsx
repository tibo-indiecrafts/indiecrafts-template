"use client";

import * as React from "react";

const DEFAULT_CHARS = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

export interface ScrambleInProps {
  text: string;
  scrambleSpeed?: number;
  scrambledLetterCount?: number;
  characters?: string;
  className?: string;
  scrambledClassName?: string;
  autoStart?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

export interface ScrambleInHandle {
  start: () => void;
  reset: () => void;
}

export const ScrambleIn = React.forwardRef<ScrambleInHandle, ScrambleInProps>(
  function ScrambleIn(
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 2,
      characters = DEFAULT_CHARS,
      className,
      scrambledClassName,
      autoStart = true,
      onStart,
      onComplete,
    },
    ref,
  ) {
    // isAnimating drives the interval-effect lifecycle. Seeded from autoStart
    // so the first run begins on mount without a setState-in-effect.
    const [isAnimating, setIsAnimating] = React.useState(autoStart);
    const [displayText, setDisplayText] = React.useState("");
    const [revealedCount, setRevealedCount] = React.useState(0);

    const visibleRef = React.useRef(0);
    const offsetRef = React.useRef(0);

    const start = React.useCallback(() => {
      visibleRef.current = 0;
      offsetRef.current = 0;
      setDisplayText("");
      setRevealedCount(0);
      setIsAnimating(true);
    }, []);

    const reset = React.useCallback(() => {
      visibleRef.current = 0;
      offsetRef.current = 0;
      setDisplayText("");
      setRevealedCount(0);
      setIsAnimating(false);
    }, []);

    React.useImperativeHandle(ref, () => ({ start, reset }), [start, reset]);

    React.useEffect(() => {
      if (!isAnimating) return;
      onStart?.();

      const interval = setInterval(() => {
        if (visibleRef.current < text.length) {
          visibleRef.current += 1;
        } else if (offsetRef.current < scrambledLetterCount) {
          offsetRef.current += 1;
        } else {
          clearInterval(interval);
          setIsAnimating(false);
          onComplete?.();
          return;
        }

        const remainingSpace = Math.max(0, text.length - visibleRef.current);
        const currentScrambleCount = Math.min(
          remainingSpace,
          scrambledLetterCount - offsetRef.current,
        );
        let scrambled = "";
        for (let i = 0; i < currentScrambleCount; i++) {
          scrambled += characters[Math.floor(Math.random() * characters.length)];
        }

        setRevealedCount(visibleRef.current);
        setDisplayText(text.slice(0, visibleRef.current) + scrambled);
      }, scrambleSpeed);

      return () => clearInterval(interval);
    }, [
      isAnimating,
      text,
      scrambleSpeed,
      scrambledLetterCount,
      characters,
      onStart,
      onComplete,
    ]);

    const revealed = displayText.slice(0, revealedCount);
    const scrambled = displayText.slice(revealedCount);

    return (
      <>
        <span className="sr-only">{text}</span>
        <span className="inline-block whitespace-pre-wrap" aria-hidden="true">
          <span className={className}>{revealed}</span>
          <span className={scrambledClassName}>{scrambled}</span>
        </span>
      </>
    );
  },
);
