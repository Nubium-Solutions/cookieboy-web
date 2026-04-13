import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps) {
  const { size = 20, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export function IconCellular(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <rect x="2" y="14" width="3" height="6" rx="0.5" />
      <rect x="7" y="11" width="3" height="9" rx="0.5" />
      <rect x="12" y="7" width="3" height="13" rx="0.5" />
      <rect x="17" y="3" width="3" height="17" rx="0.5" />
    </svg>
  );
}

export function IconWifi(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5 12a11 11 0 0 1 14 0" />
      <path d="M8.5 15.5a6 6 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconBattery(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <rect x="22" y="10" width="1" height="4" rx="0.5" fill="currentColor" stroke="none" />
      <path d="M10 11l-2 3h3l-1 2" strokeWidth="1.5" />
    </svg>
  );
}

export function IconGraphUp(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M3 17l5-5 4 4 7-8" />
      <path d="M14 8h5v5" />
    </svg>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden>
      <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
