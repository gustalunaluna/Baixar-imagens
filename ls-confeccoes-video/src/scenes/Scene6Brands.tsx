import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrapper, GridBackground } from "../components/Shared";
import { THEME, FONTS, BRANDS } from "../theme";

export const Scene6Brands: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const header = spring({ frame, fps, config: { damping: 18 } });
  const cardProg = (i: number) =>
    spring({ frame: frame - 20 - i * 7, fps, config: { damping: 14, mass: 0.6 } });

  return (
    <SceneWrapper durationInFrames={120}>
      <div style={{ width: 940, height: 600, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <GridBackground />

        <div
          style={{
            opacity: header,
            transform: `translateY(${interpolate(header, [0, 1], [-20, 0])}px)`,
            textAlign: "center",
            marginBottom: 36,
            position: "relative",
          }}
        >
          <div style={{ color: THEME.accent, fontFamily: FONTS.ui, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            Quem confia na gente
          </div>
          <div style={{ color: THEME.white, fontFamily: FONTS.ui, fontSize: 40, fontWeight: 800, marginTop: 8 }}>
            +500 marcas confiam na <span style={{ color: THEME.accent }}>LS</span>
          </div>
          <div style={{ color: THEME.muted, fontFamily: FONTS.ui, fontSize: 16, marginTop: 8 }}>
            Marcas de streetwear, moda e clubes de futebol
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, position: "relative" }}>
          {BRANDS.map((b, i) => {
            const pr = cardProg(i);
            return (
              <div
                key={i}
                style={{
                  opacity: pr,
                  transform: `scale(${interpolate(pr, [0, 1], [0.8, 1])})`,
                  width: 180,
                  height: 80,
                  background: THEME.surface2,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: 10, left: 10, width: 7, height: 7, borderRadius: 4, background: THEME.accent }} />
                <span style={{ color: THEME.white, fontFamily: FONTS.ui, fontSize: 17, fontWeight: 800, letterSpacing: 0.5 }}>
                  {b}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SceneWrapper>
  );
};
