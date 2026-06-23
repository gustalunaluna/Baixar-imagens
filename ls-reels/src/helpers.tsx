import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { T } from "./theme";

export const Slide: React.FC<{ children: React.ReactNode; dur: number; bg?: string }> = ({
  children,
  dur,
  bg = T.bg,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const exit = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 12], [30, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ opacity: Math.min(enter, exit), transform: `translateY(${y}px)`, width: "100%" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const useCountUp = (target: number, startFrame = 0, durationFrames = 40) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - p, 3);
  return Math.floor(eased * target);
};

export const Grid: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.1 }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="g" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0 L0 0 0 44" fill="none" stroke={T.border} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
  </AbsoluteFill>
);

export const springIn = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.7 } });
