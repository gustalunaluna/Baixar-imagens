import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AppWindow } from "../components/AppWindow";
import { SceneWrapper } from "../components/Shared";
import { THEME, FONTS, CUSTOMIZATION } from "../theme";

export const Scene5Customization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modal = spring({ frame, fps, config: { damping: 18, mass: 0.8 } });
  const itemProg = (i: number) =>
    spring({ frame: frame - 18 - i * 8, fps, config: { damping: 16, mass: 0.6 } });

  const badgeColor = (auth: string) =>
    auth === "Incluso" ? THEME.accent : auth === "Opcional" ? THEME.pink : THEME.muted;

  return (
    <SceneWrapper durationInFrames={140}>
      <AppWindow title="LS Confecções — Personalização" width={940} height={600}>
        <div style={{ width: "100%", height: "100%", background: THEME.bg, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 30,
            }}
          >
            <div
              style={{
                opacity: modal,
                transform: `scale(${interpolate(modal, [0, 1], [0.92, 1])})`,
                width: "100%",
                maxWidth: 820,
                background: THEME.surface,
                border: `1px solid ${THEME.border}`,
                borderRadius: 16,
                padding: 26,
              }}
            >
              <div style={{ color: THEME.white, fontFamily: FONTS.ui, fontSize: 22, fontWeight: 800 }}>
                Personalização total — <span style={{ color: THEME.accent }}>tudo com a sua marca</span>
              </div>
              <div style={{ color: THEME.muted, fontFamily: FONTS.ui, fontSize: 14, marginTop: 4, marginBottom: 18 }}>
                6 formas de deixar o produto com a identidade do seu negócio
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                {["Tudo", "Incluso", "À escolha", "Opcional"].map((f, i) => (
                  <div
                    key={f}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 16,
                      background: i === 0 ? THEME.accent : THEME.surface2,
                      color: i === 0 ? THEME.bg : THEME.muted,
                      border: `1px solid ${i === 0 ? THEME.accent : THEME.border}`,
                      fontFamily: FONTS.ui,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {CUSTOMIZATION.map((c, i) => {
                  const pr = itemProg(i);
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: pr,
                        transform: `translateY(${interpolate(pr, [0, 1], [20, 0])}px)`,
                        background: THEME.surface2,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background: THEME.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: THEME.accent,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {i + 1}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            fontFamily: FONTS.ui,
                            fontWeight: 700,
                            color: badgeColor(c.auth),
                            border: `1px solid ${badgeColor(c.auth)}`,
                            borderRadius: 10,
                            padding: "3px 8px",
                          }}
                        >
                          {c.auth}
                        </div>
                      </div>
                      <div style={{ color: THEME.white, fontFamily: FONTS.ui, fontSize: 15, fontWeight: 700 }}>
                        {c.name}
                      </div>
                      <div style={{ color: THEME.dim, fontFamily: FONTS.ui, fontSize: 12, marginTop: 3 }}>
                        {c.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AppWindow>
    </SceneWrapper>
  );
};
