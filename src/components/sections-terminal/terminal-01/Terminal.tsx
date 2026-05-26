"use client";

import * as React from "react";

import { TypingAnimation } from "@/components/ui-effects/typing-animation";
import { ShimmerLoader } from "@/components/ui-molecules/widget/shimmer-loader";
import { useScopedT } from "@/components/_lib/scoped-t";

import { terminal01Namespace } from "./config";
import type { TerminalBlock, TerminalPhase } from "./schema";

type BarPhase = Extract<TerminalPhase, { type: "bar" }>;

type RenderedItem =
  | { id: string; kind: "divider" }
  | { id: string; kind: "bar"; phase: BarPhase }
  | { id: string; kind: "line"; text: string }
  | { id: string; kind: "message"; text: string };

function Divider() {
  return (
    <div className="font-mono text-xs leading-none text-zinc-300/40 select-none">
      {"─".repeat(44)}
    </div>
  );
}

const TYPE_SPEED_MS = 40;
const LINE_BUFFER_MS = 250;

export default function Terminal(props: Readonly<TerminalBlock>) {
  const [, , tRoot] = useScopedT(terminal01Namespace);
  const [items, setItems] = React.useState<RenderedItem[]>([]);

  const phaseRef = React.useRef(0);
  const tRootRef = React.useRef(tRoot);
  const sequenceRef = React.useRef(props.sequence);
  const timeoutsRef = React.useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  React.useEffect(() => {
    tRootRef.current = tRoot;
  }, [tRoot]);

  React.useEffect(() => {
    sequenceRef.current = props.sequence;
  }, [props.sequence]);

  const schedule = React.useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
    return id;
  }, []);

  const advanceRef = React.useRef<() => void>(() => {});

  const advance = React.useCallback(() => {
    const sequence = sequenceRef.current;
    const phase = sequence[phaseRef.current];
    if (!phase) return;

    if (phase.type === "divider") {
      const id = `divider-${phaseRef.current}`;
      setItems((prev) => [...prev, { id, kind: "divider" }]);
      phaseRef.current++;
      schedule(() => advanceRef.current(), 80);
      return;
    }

    if (phase.type === "bar") {
      const id = `bar-${phaseRef.current}`;
      setItems((prev) => [...prev, { id, kind: "bar", phase }]);
      phaseRef.current++;
      return;
    }

    if (phase.type === "lines") {
      const linesPhase = phase;
      const startedAtPhase = phaseRef.current;
      phaseRef.current++;
      const typeLine = (idx: number) => {
        if (idx >= linesPhase.lineKeys.length) {
          schedule(() => advanceRef.current(), 200);
          return;
        }
        const text = tRootRef.current(linesPhase.lineKeys[idx]);
        const id = `line-${startedAtPhase}-${idx}`;
        setItems((prev) => [...prev, { id, kind: "line", text }]);
        const isLast = idx === linesPhase.lineKeys.length - 1;
        const ms = text.length * TYPE_SPEED_MS + LINE_BUFFER_MS + (isLast ? 0 : 200);
        schedule(() => typeLine(idx + 1), ms);
      };
      typeLine(0);
      return;
    }

    if (phase.type === "message") {
      const id = `msg-${phaseRef.current}`;
      const text = tRootRef.current(phase.textKey);
      setItems((prev) => [...prev, { id, kind: "message", text }]);
      phaseRef.current++;
      schedule(() => advanceRef.current(), 400);
    }
  }, [schedule]);

  React.useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  React.useEffect(() => {
    schedule(() => advanceRef.current(), 300);
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
    };
  }, [schedule]);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background py-12 lg:py-20"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        {tRoot(props.titleKey)}
      </h2>

      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="flex min-h-[280px] flex-col gap-1.5 rounded-2xl border border-zinc-50/5 bg-[#0f0e17] p-7 font-mono text-sm text-zinc-100">
          {items.map((item) => {
            if (item.kind === "divider") {
              return <Divider key={item.id} />;
            }
            if (item.kind === "bar") {
              const labels = item.phase.labelKeys.map((k) => tRoot(k));
              return (
                <ShimmerLoader
                  key={item.id}
                  labels={labels}
                  icons={item.phase.icons}
                  duration={item.phase.duration}
                  tokenTarget={item.phase.tokenTarget}
                  showPercent={item.phase.showPercent}
                  onComplete={() => schedule(advance, 150)}
                />
              );
            }
            if (item.kind === "line") {
              return (
                <div key={item.id} className="flex items-baseline gap-2 leading-tight">
                  <span aria-hidden="true" className="text-violet-400/70 select-none">
                    ▸
                  </span>
                  <TypingAnimation
                    typeSpeed={TYPE_SPEED_MS}
                    blinkCursor
                    showCursor
                    className="leading-tight text-zinc-200"
                  >
                    {item.text}
                  </TypingAnimation>
                </div>
              );
            }
            return (
              <div key={item.id} className="pl-1 text-sm font-semibold text-violet-400">
                {item.text}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
