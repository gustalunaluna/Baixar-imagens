import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { THEME } from "../theme";

export const SceneWrapper: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.7 } });
  const enterScale = interpolate(enter, [0, 1], [0.95, 1]);
  const enterOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const exitStart = durationInFrames - 12;
  const exitScale = interpolate(frame, [exitStart, durationInFrames], [1, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        opacity: Math.min(enterOpacity, exitOpacity),
        transform: `scale(${frame < exitStart ? enterScale : exitScale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const GridBackground: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.12 }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={THEME.border} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </AbsoluteFill>
);

export const useStagger = (index: number, delayPerItem = 6, dampening = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - index * delayPerItem,
    fps,
    config: { damping: dampening, mass: 0.6 },
  });
};
