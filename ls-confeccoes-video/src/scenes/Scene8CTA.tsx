import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrapper, GridBackground } from "../components/Shared";
import { THEME, FONTS } from "../theme";

export const Scene8CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const label = spring({ frame, fps, config: { damping: 18 } });
  const logo = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const logoRot = interpolate(logo, [0, 1], [-180, 0]);
  const cta = spring({ frame: frame - 30, fps, config: { damping: 16 } });
  const card = spring({ frame: frame - 45, fps, config: { damping: 16 } });

  const pulse = 1 + Math.sin(frame / 10) * 0.03;

  return (
    <SceneWrapper durationInFrames={120}>
      <div style={{ width: 940, height: 600, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <GridBackground />

        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + frame / 40;
          const r = 220;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r * 0.6;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "42%",
                color: THEME.accent,
                fontSize: 18,
                opacity: 0.5,
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              ✦
            </div>
          );
        })}

        <div
          style={{
            opacity: label,
            color: THEME.accent,
            fontFamily: FONTS.ui,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          Sua marca. Nossa produção.
        </div>

        <div
          style={{
            opacity: logo,
            transform: `rotate(${logoRot}deg) scale(${interpolate(logo, [0, 1], [0.5, 1])})`,
            width: 90,
            height: 90,
            borderRadius: 22,
            border: `3px solid ${THEME.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: THEME.accent,
            fontFamily: FONTS.brand,
            fontWeight: 700,
            fontSize: 42,
            position: "relative",
          }}
        >
          LS
        </div>

        <div
          style={{
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [20, 0])}px)`,
            color: THEME.white,
            fontFamily: FONTS.ui,
            fontSize: 34,
            fontWeight: 800,
            textAlign: "center",
            position: "relative",
          }}
        >
          Peça seu orçamento sem compromisso
        </div>

        <div
          style={{
            opacity: cta,
            transform: `scale(${pulse})`,
            background: THEME.accent,
            color: THEME.bg,
            fontFamily: FONTS.ui,
            fontSize: 20,
            fontWeight: 800,
            padding: "16px 36px",
            borderRadius: 30,
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>💬</span> WhatsApp (11) 99937-0418
        </div>

        <div
          style={{
            opacity: card,
            transform: `translateY(${interpolate(card, [0, 1], [20, 0])}px)`,
            background: THEME.surface2,
            border: `1px solid ${THEME.border}`,
            borderRadius: 12,
            padding: "12px 24px",
            display: "flex",
            gap: 24,
            position: "relative",
          }}
        >
          <span style={{ color: THEME.muted, fontFamily: FONTS.mono, fontSize: 15 }}>🌐 www.lsconfex.com.br</span>
          <span style={{ color: THEME.border }}>|</span>
          <span style={{ color: THEME.muted, fontFamily: FONTS.mono, fontSize: 15 }}>📸 @lsconfex</span>
        </div>
      </div>
    </SceneWrapper>
  );
};
