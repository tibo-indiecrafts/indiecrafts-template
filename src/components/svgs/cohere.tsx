import type { SVGProps } from "react";

const Cohere = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    style={{ flex: "none", lineHeight: "1" }}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#39594D"
      d="M6.957 13.66a4.95 4.95 0 0 0 1.13.13h2.343a.85.85 0 0 0 0-1.703H8.085a.85.85 0 0 1-.85-.85V9.51a.85.85 0 0 1 .85-.85h2.345a.85.85 0 0 0 0-1.703H8.085a4.95 4.95 0 0 0-4.95 4.95v.726a.85.85 0 0 0 1.7 0v-.013a3.246 3.246 0 0 1 2.122-3.046v3.073a.85.85 0 0 0 0 .013z"
    />
    <path
      fill="#D18EE2"
      d="M9.918 15.34v.42a3.236 3.236 0 0 0 3.235 3.236h.84a3.236 3.236 0 0 0 0-6.472h-2.59A1.484 1.484 0 0 0 9.918 14a1.484 1.484 0 0 0 0 1.34z"
    />
    <path
      fill="#FF7759"
      d="M16.36 9.21a2.857 2.857 0 1 1-5.715 0 2.857 2.857 0 0 1 5.715 0z"
    />
  </svg>
);

export { Cohere };
