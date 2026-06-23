import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { SceneWrapper, GridBackground } from "../components/Shared";
import { THEME, FONTS } from "../theme";

const DIFFS = [
  { num: "+10", label: "anos de experiência" },
  { num: "+500", label: "marcas atendidas" },
  { num: "20", label: "unidades (mínimo)" },
  { num: "+800", label: "modelos disponíveis" },
];

const IntroBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = spring({ frame, fps, config: { damping: 12 } });
  const scale = interpolate(ring, [0, 1], [0, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const len = interpolate(frame, [0, 30], [300, 60], { extrapolateRight: "clamp" });
        const op = interpolate(frame, [0, 15, 40], [0, 1, 0], { extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 3,
              height: len,
              background: `linear-gradient(${THEME.accent}, transparent)`,
              opacity: op,
              transform: `rotate(${angle}rad) translateY(-${len}px)`,
              transformOrigin: "center bottom",
            }}
          />
        );
      })}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          border: `3px solid ${THEME.accent}`,
          transform: `scale(${scale})`,
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME.accent,
          fontFamily: FONTS.brand,
          fontWeight: 700,
          fontSize: 44,
        }}
      >
        LS
      </div>
    </div>
  );
};

const WordReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ["Private", "label", "premium", "para", "a", "sua", "marca"];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ color: THEME.accent, fontFamily: FONTS.ui, fontSize: 18, letterSpacing: 3 }}>✦ DIFERENCIAIS ✦</div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
        {words.map((w, i) => {
          const op = interpolate(frame, [i * 5, i * 5 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(frame, [i * 5, i * 5 + 8], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span key={i} style={{ opacity: op, transform: `translateY(${y}px)`, color: THEME.white, fontFamily: FONTS.ui, fontSize: 50, fontWeight: 800 }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const StatsRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
      {DIFFS.map((d, i) => {
        const pr = spring({ frame: frame - i * 8, fps, config: { damping: 14 } });
        return (
          <div
            key={i}
            style={{
              opacity: pr,
              transform: `scale(${interpolate(pr, [0, 1], [0.7, 1])})`,
              width: 180,
              height: 150,
              background: THEME.surface2,
              border: `1px solid ${THEME.border}`,
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div style={{ color: THEME.accent, fontFamily: FONTS.ui, fontSize: 46, fontWeight: 800 }}>{d.num}</div>
            <div style={{ color: THEME.muted, fontFamily: FONTS.ui, fontSize: 14, textAlign: "center", padding: "0 12px" }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Scene7Combo: React.FC = () => {
  return (
    <SceneWrapper durationInFrames={180}>
      <div style={{ width: 940, height: 600, position: "relative", overflow: "hidden" }}>
        <GridBackground />
        <Sequence from={0} durationInFrames={50}>
          <IntroBurst />
        </Sequence>
        <Sequence from={50} durationInFrames={60}>
          <WordReveal />
        </Sequence>
        <Sequence from={110} durationInFrames={70}>
          <StatsRow />
        </Sequence>
      </div>
    </SceneWrapper>
  );
};
