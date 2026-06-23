import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AppWindow } from "../components/AppWindow";
import { SceneWrapper, GridBackground } from "../components/Shared";
import { THEME, FONTS } from "../theme";

export const Scene2Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stag = (d: number) =>
    spring({ frame: frame - d, fps, config: { damping: 16, mass: 0.7 } });

  const title = stag(6);
  const tagline = stag(16);
  const input = stag(26);
  const chips = stag(36);

  return (
    <SceneWrapper durationInFrames={150}>
      <AppWindow title="LS Confecções — Private Label" width={940} height={600}>
        <div style={{ position: "relative", width: "100%", height: "100%", background: THEME.surface }}>
          <GridBackground />
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
              padding: 40,
            }}
          >
            <div
              style={{
                opacity: title,
                transform: `scale(${interpolate(title, [0, 1], [0.8, 1])})`,
                width: 64,
                height: 64,
                borderRadius: 16,
                border: `2px solid ${THEME.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: THEME.accent,
                fontFamily: FONTS.brand,
                fontWeight: 700,
                fontSize: 30,
                marginBottom: 6,
              }}
            >
              LS
            </div>

            <div
              style={{
                opacity: title,
                transform: `translateY(${interpolate(title, [0, 1], [20, 0])}px)`,
                fontFamily: FONTS.ui,
                fontSize: 50,
                fontWeight: 800,
                color: THEME.white,
                textAlign: "center",
                letterSpacing: -1,
              }}
            >
              SUA MARCA. <span style={{ color: THEME.accent }}>NOSSA PRODUÇÃO.</span>
            </div>

            <div
              style={{
                opacity: tagline,
                transform: `translateY(${interpolate(tagline, [0, 1], [20, 0])}px)`,
                fontFamily: FONTS.ui,
                fontSize: 19,
                color: THEME.muted,
                textAlign: "center",
              }}
            >
              Bolsas, mochilas e acessórios private label · a partir de 20 unidades
            </div>

            <div
              style={{
                opacity: input,
                transform: `translateY(${interpolate(input, [0, 1], [24, 0])}px)`,
                marginTop: 14,
                width: 560,
                height: 56,
                background: THEME.surface2,
                border: `1px solid ${THEME.border}`,
                borderRadius: 28,
                display: "flex",
                alignItems: "center",
                padding: "0 8px 0 22px",
              }}
            >
              <span style={{ flex: 1, color: THEME.dim, fontFamily: FONTS.ui, fontSize: 16 }}>
                Descreva o produto que você quer criar...
              </span>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  background: THEME.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: THEME.bg,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                →
              </div>
            </div>

            <div
              style={{
                opacity: chips,
                transform: `translateY(${interpolate(chips, [0, 1], [20, 0])}px)`,
                display: "flex",
                gap: 12,
                marginTop: 6,
              }}
            >
              {["Bordado", "Silk", "Sua logo", "Embalagem"].map((c) => (
                <div
                  key={c}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    background: THEME.surface2,
                    border: `1px solid ${THEME.border}`,
                    color: THEME.muted,
                    fontFamily: FONTS.ui,
                    fontSize: 14,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppWindow>
    </SceneWrapper>
  );
};
