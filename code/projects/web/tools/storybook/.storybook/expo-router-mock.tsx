import type { ReactNode } from "react";

/**
 * Storybook stand-in for `expo-router`. File-based navigation has no meaning in an
 * isolated story canvas — every hook/component below is an inert no-op or passthrough,
 * just enough for mobile screens to mount without a real router mounted above them.
 */
export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    back: () => {},
    canGoBack: () => false,
  };
}

export function usePathname(): string {
  return "/";
}

export function Link({
  href,
  children,
  ...props
}: {
  href: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <a href={typeof href === "string" ? href : "#"} {...props}>
      {children}
    </a>
  );
}

export function Redirect() {
  return null;
}

export function Stack({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
Stack.Screen = function StackScreen() {
  return null;
};

/** Type-only in real usage (expo-router's error-boundary prop shape). */
export type ErrorBoundaryProps = { error: Error; retry: () => void };

export default { useRouter, usePathname, Link, Redirect, Stack };
