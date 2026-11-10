import React from "react";
import { skillIconName } from "../apps/skills-api/src/icons";

// Lucide (ISC) shapes behind the Skills API icon_url, inlined because the CSP blocks remote images.
// A string is a path `d`; a tuple is another SVG element.
type Shape = string | [string, Record<string, string>];
export const skillIconShapes: Record<string, Shape[]> = {
  rocket: [
    "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",
    "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",
    "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",
  ],
  "shield-alert": [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zm-8-5v4m0 4h.01",
  ],
  "chart-column": ["M3 3v16a2 2 0 0 0 2 2h16m-3-4V9m-5 8V5M8 17v-3"],
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87",
    ["circle", { cx: "9", cy: "7", r: "4" }],
  ],
  medal: [
    "M7.21 15L2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15M11 12L5.12 2.2M13 12l5.88-9.8M8 7h8",
    ["circle", { cx: "12", cy: "17", r: "5" }],
    "M12 18v-2h-.5",
  ],
  droplets: [
    "M7 16.3c2.2 0 4-1.83 4-4.05c0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05",
    "M12.56 6.6A11 11 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
  ],
  wallet: [
    "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
    "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
  ],
  radio: [
    "M16.247 7.761a6 6 0 0 1 0 8.478m2.828-11.306a10 10 0 0 1 0 14.134m-14.15 0a10 10 0 0 1 0-14.134m2.828 11.306a6 6 0 0 1 0-8.478",
    ["circle", { cx: "12", cy: "12", r: "2" }],
  ],
  "trending-up": ["M16 7h6v6", "m22 7l-8.5 8.5l-5-5L2 17"],
  "clipboard-check": [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
    "m9 14l2 2l4-4",
  ],
  flame: [
    "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0a5 5 0 0 1 1-3a1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
  ],
  "wallet-cards": [
    "M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21M3 7h18",
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ],
  "shield-check": [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12l2 2l4-4",
  ],
  "scan-search": [
    "M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2",
    ["circle", { cx: "12", cy: "12", r: "3" }],
    "m16 16l-1.9-1.9",
  ],
  "chart-candlestick": [
    "M9 5v4",
    ["rect", { width: "4", height: "6", x: "7", y: "9", rx: "1" }],
    "M9 15v2m8-14v2",
    ["rect", { width: "4", height: "8", x: "15", y: "5", rx: "1" }],
    "M17 13v3M3 3v16a2 2 0 0 0 2 2h16",
  ],
  "badge-check": [
    "M3.85 8.62a4 4 0 0 1 4.78-4.77a4 4 0 0 1 6.74 0a4 4 0 0 1 4.78 4.78a4 4 0 0 1 0 6.74a4 4 0 0 1-4.77 4.78a4 4 0 0 1-6.75 0a4 4 0 0 1-4.78-4.77a4 4 0 0 1 0-6.76",
    "m16 9l-5.5 5.5L8 12",
  ],
  "sliders-horizontal": [
    "M10 5H3m9 14H3M14 3v4m2 10v4m5-9h-9m9 7h-5m5-14h-7m-6 5v4m0-2H3",
  ],
  "chart-no-axes-combined": [
    "M12 16v5m4-6.361V21m4-10.344V21m2-18l-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15m2 3.463V21m4-6.344V21",
  ],
  "user-search": [
    ["circle", { cx: "10", cy: "7", r: "4" }],
    "M10.3 15H7a4 4 0 0 0-4 4v2",
    ["circle", { cx: "17", cy: "17", r: "3" }],
    "m21 21l-1.9-1.9",
  ],
  trophy: [
    "M10 14.66V17a1 1 0 0 1-1 1a2 2 0 0 0-2 2v2m7-7.34V17a1 1 0 0 0 1 1a2 2 0 0 1 2 2v2m.916-12H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3M4 22h16",
    "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
    "M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3",
  ],
  "file-text": [
    "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
    "M14 2v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8",
  ],
};

export function SkillIcon({
  kind,
  size = 20,
}: {
  kind: string;
  size?: number;
}) {
  const shapes =
    skillIconShapes[skillIconName(kind)] ?? skillIconShapes["file-text"];
  return (
    <svg
      className="skill-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes.map((shape, i) =>
        typeof shape === "string" ? (
          <path key={i} d={shape} />
        ) : (
          React.createElement(shape[0], { key: i, ...shape[1] })
        ),
      )}
    </svg>
  );
}
