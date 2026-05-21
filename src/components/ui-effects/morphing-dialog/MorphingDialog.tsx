"use client";

import { XIcon } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variant,
} from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type MorphingDialogContextValue = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const MorphingDialogContext = React.createContext<MorphingDialogContextValue | null>(
  null,
);

function useMorphingDialog(consumer: string) {
  const ctx = React.useContext(MorphingDialogContext);
  if (!ctx) {
    throw new Error(`${consumer} must be used within a <MorphingDialog>`);
  }
  return ctx;
}

function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
) {
  const handlerRef = React.useRef(handler);
  React.useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  React.useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handlerRef.current();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref]);
}

const mountedSubscribe = () => () => {};
const mountedSnapshot = () => true;
const mountedServerSnapshot = () => false;

export type MorphingDialogProps = {
  children: React.ReactNode;
  transition?: Transition;
};

export function MorphingDialog({ children, transition }: Readonly<MorphingDialogProps>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const uniqueId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const contextValue = React.useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId],
  );

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

export type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogTrigger({
  children,
  className,
  style,
}: Readonly<MorphingDialogTriggerProps>) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog(
    "MorphingDialogTrigger",
  );

  const handleClick = () => setIsOpen((prev) => !prev);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <motion.button
      ref={triggerRef}
      type="button"
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative cursor-pointer", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`morphing-dialog-content-${uniqueId}`}
    >
      {children}
    </motion.button>
  );
}

export type MorphingDialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogContent({
  children,
  className,
  style,
}: Readonly<MorphingDialogContentProps>) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog(
    "MorphingDialogContent",
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !containerRef.current) return;
      const focusables =
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
      return;
    }
    document.body.classList.add("overflow-hidden");
    const focusables =
      containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusables?.[0]?.focus();
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("overflow-hidden", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      id={`morphing-dialog-content-${uniqueId}`}
      aria-labelledby={`morphing-dialog-title-${uniqueId}`}
      aria-describedby={`morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogContainerProps = {
  children: React.ReactNode;
};

export function MorphingDialogContainer({
  children,
}: Readonly<MorphingDialogContainerProps>) {
  const { isOpen, uniqueId } = useMorphingDialog("MorphingDialogContainer");
  const mounted = React.useSyncExternalStore(
    mountedSubscribe,
    mountedSnapshot,
    mountedServerSnapshot,
  );
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 z-40 h-full w-full bg-white/40 backdrop-blur-xs dark:bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export type MorphingDialogTitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogTitle({
  children,
  className,
  style,
}: Readonly<MorphingDialogTitleProps>) {
  const { uniqueId } = useMorphingDialog("MorphingDialogTitle");
  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogSubtitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogSubtitle({
  children,
  className,
  style,
}: Readonly<MorphingDialogSubtitleProps>) {
  const { uniqueId } = useMorphingDialog("MorphingDialogSubtitle");
  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

export function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: Readonly<MorphingDialogDescriptionProps>) {
  const { uniqueId } = useMorphingDialog("MorphingDialogDescription");
  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation ? undefined : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: Readonly<MorphingDialogImageProps>) {
  const { uniqueId } = useMorphingDialog("MorphingDialogImage");
  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  );
}

export type MorphingDialogCloseProps = {
  children?: React.ReactNode;
  className?: string;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

export function MorphingDialogClose({
  children,
  className,
  variants,
}: Readonly<MorphingDialogCloseProps>) {
  const { setIsOpen, uniqueId } = useMorphingDialog("MorphingDialogClose");
  return (
    <motion.button
      onClick={() => setIsOpen(false)}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn("absolute top-6 right-6", className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || <XIcon size={24} aria-hidden="true" />}
    </motion.button>
  );
}
