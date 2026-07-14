import type { SVGProps } from "react";

export function Linear(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default Linear;
