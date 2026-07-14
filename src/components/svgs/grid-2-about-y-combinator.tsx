import type { SVGProps } from "react";

export const YCombinator = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_38_2)">
        <path d="M120 0H0V120H120V0Z" fill="#FB651E" />
        <path
          d="M55.9566 67.8495L35.3594 29.2646H44.7726L56.8886 53.6831C57.075 54.118 57.2924 54.5684 57.541 55.0345C57.7895 55.5005 58.007 55.982 58.1934 56.479C58.3176 56.6654 58.4108 56.8363 58.473 56.9916C58.5351 57.147 58.5972 57.2868 58.6594 57.411C58.97 58.0324 59.2496 58.6382 59.4982 59.2284C59.7467 59.8187 59.9642 60.3624 60.1506 60.8595C60.6476 59.8032 61.1913 58.6693 61.7816 57.4576C62.3718 56.246 62.9776 54.9879 63.599 53.6831L75.9014 29.2646H84.6622L63.8786 68.3154V93.1998H55.9566V67.8495Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_38_2">
          <rect width="120" height="120" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
