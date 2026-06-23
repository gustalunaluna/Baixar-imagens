import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AppWindow } from "../components/AppWindow";
import { SceneWrapper } from "../components/Shared";
import { THEME, FONTS, PRODUCTS } from "../theme";

export const Scene4Products: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const itemProg = (i: number) =>
    spring({ frame: frame - 12 - i * 7, fps, config: { damping: 16, mass: 0.6 } });

  const header = spring({ frame, fps, config: { damping: 18 } });

  return (
    <SceneWrapper durationInFrames={130}>
      <AppWindow title="LS Confecções — Catálogo" width={940} height={600}>
        <div style={{ width: "100%", height: "100%", background: THEME.surface, padding: 28 }}>
          <div
            style={{
              opacity: header,
              transform: `translateY(${interpolate(header, [0, 1], [-15, 0])}px)`,
              marginBottom: 22,
            }}
          >
            <div style={{ color: THEME.accent, fontFamily: FONTS.ui, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Catálogo de produtos
            </div>
            <div style={{ color: THEME.white, fontFamily: FONTS.ui, fontSize: 26, fontWeight: 800, marginTop: 4 }}>
              +800 modelos para a sua marca
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {PRODUCTS.map((p, i) => {
              const pr = itemProg(i);
              return (
                <div
                  key={i}
                  style={{
                    opacity: pr,
                    transform: `translateY(${interpolate(pr, [0, 1], [24, 0])}px) scale(${interpolate(pr, [0, 1], [0.9, 1])})`,
                    background: THEME.surface2,
                    border: `1px solid ${THEME.border}`,
                    borderRadius: 12,
                    padding: 16,
                    height: 150,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 64,
                      borderRadius: 8,
                      background: THEME.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <svg width="38" height="34" viewBox="0 0 38 34" fill="none">
                      <rect x="6" y="11" width="26" height="20" rx="3" stroke={THEME.accent} strokeWidth="2" />
                      <path d="M12 11 Q12 4 19 4 Q26 4 26 11" stroke={THEME.accent} strokeWidth="2" fill="none" />
                      <line x1="6" y1="18" x2="32" y2="18" stroke={THEME.accent} strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div style={{ color: THEME.accent, fontFamily: FONTS.ui, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {p.tag}
                  </div>
                  <div style={{ color: THEME.white, fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700, marginTop: 2 }}>
                    {p.name}
                  </div>
                  <div style={{ color: THEME.dim, fontFamily: FONTS.ui, fontSize: 11, marginTop: 4 }}>
                    {p.spec}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              textAlign: "center",
              marginTop: 24,
              color: THEME.muted,
              fontFamily: FONTS.ui,
              fontSize: 15,
            }}
          >
            Shoulder bags · Pochetes · Mochilas · Totes · Ecobags · <span style={{ color: THEME.accent }}>e muito mais</span>
          </div>
        </div>
      </AppWindow>
    </SceneWrapper>
  );
};
