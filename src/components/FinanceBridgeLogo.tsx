import React from "react";

interface FinanceBridgeLogoProps {
  className?: string;
  size?: number | string;
}

export default function FinanceBridgeLogo({ className = "", size = "100%" }: FinanceBridgeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <marker
          id="finance-bridge-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
        </marker>
      </defs>

      {/* Main Bridge Deck */}
      <path
        d="M 20,130 L 180,130"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Pillars */}
      <path
        d="M 65,90 L 65,170"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 135,90 L 135,170"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Side Suspension Cables */}
      <path
        d="M 20,130 Q 55,130 65,100"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 135,100 Q 145,130 180,130"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Under deck Arch */}
      <path
        d="M 65,165 Q 100,132 135,165"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bar Chart (representing the bars in the middle) */}
      <rect x="77" y="121" width="8" height="9" rx="1" fill="currentColor" />
      <rect x="90" y="113" width="8" height="17" rx="1" fill="currentColor" />
      <rect x="103" y="105" width="8" height="25" rx="1" fill="currentColor" />
      <rect x="116" y="93" width="8" height="37" rx="1" fill="currentColor" />

      {/* Arrow Trend Line */}
      <path
        d="M 74,119 L 95,101 L 101,105 L 129,78"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        markerEnd="url(#finance-bridge-arrow)"
      />
    </svg>
  );
}
