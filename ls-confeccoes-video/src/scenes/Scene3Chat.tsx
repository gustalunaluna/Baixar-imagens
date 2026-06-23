import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AppWindow } from "../components/AppWindow";
import { SceneWrapper } from "../components/Shared";
import { THEME, FONTS } from "../theme";

const HISTORY = ["Shoulder Bag · Marca X", "Pochete · Drop verão", "Mochila corporativa", "Tote evento"];
const STEPS = [
  { label: "Briefing recebido", done: true },
  { label: "Modelo & materiais", done: true },
  { label: "Peça-piloto aprovada", done: true },
  { label: "Produção em andamento", done: false },
];
const TOOLS = [
  "briefing.receber()",
  "amostra.aprovar()",
  "producao.iniciar()",
];

export const Scene3Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const response =
    "Perfeito! Vou produzir 30 shoulder bags com a sua logo bordada, em nylon preto com detalhe verde. Antes de produzir, te envio a peça-piloto para aprovação. Prazo: ~30 dias. Tudo com a identidade da sua marca.";
  const charsShown = Math.floor(interpolate(frame, [30, 140], [0, response.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  const stepProg = (i: number) =>
    spring({ frame: frame - 40 - i * 16, fps, config: { damping: 18 } });
  const toolProg = (i: number) =>
    spring({ frame: frame - 60 - i * 18, fps, config: { damping: 18 } });

  return (
    <SceneWrapper durationInFrames={160}>
      <AppWindow title="LS Confecções — Atendimento" width={940} height={600}>
        <div style={{ display: "flex", width: "100%", height: "100%", background: THEME.surface }}>
          <div style={{ width: 200, borderRight: `1px solid ${THEME.border}`, padding: 16, background: THEME.bg }}>
            <div style={{ color: THEME.dim, fontSize: 12, fontFamily: FONTS.ui, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              Projetos
            </div>
            {HISTORY.map((h, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 6,
                  background: i === 0 ? THEME.surface2 : "transparent",
                  border: i === 0 ? `1px solid ${THEME.border}` : "1px solid transparent",
                  color: i === 0 ? THEME.white : THEME.muted,
                  fontFamily: FONTS.ui,
                  fontSize: 13,
                }}
              >
                {h}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ alignSelf: "flex-end", maxWidth: "75%", background: THEME.accent, color: THEME.bg, padding: "10px 16px", borderRadius: 14, fontFamily: FONTS.ui, fontSize: 14, fontWeight: 500 }}>
              Quero 30 shoulder bags com a logo da minha marca 🔥
            </div>
            <div style={{ alignSelf: "flex-start", maxWidth: "85%", background: THEME.surface2, border: `1px solid ${THEME.border}`, color: THEME.white, padding: "12px 16px", borderRadius: 14, fontFamily: FONTS.ui, fontSize: 14, lineHeight: 1.5 }}>
              {response.slice(0, charsShown)}
              {charsShown < response.length && <span style={{ color: THEME.accent }}>▋</span>}
            </div>
          </div>

          <div style={{ width: 240, borderLeft: `1px solid ${THEME.border}`, padding: 18, background: THEME.bg }}>
            <div style={{ color: THEME.dim, fontSize: 12, fontFamily: FONTS.ui, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
              Status do pedido
            </div>
            {STEPS.map((s, i) => {
              const pr = stepProg(i);
              return (
                <div key={i} style={{ opacity: pr, display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: s.done ? THEME.accent : "transparent",
                      border: `2px solid ${s.done ? THEME.accent : THEME.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: THEME.bg,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {s.done ? "✓" : ""}
                  </div>
                  <span style={{ color: s.done ? THEME.white : THEME.muted, fontFamily: FONTS.ui, fontSize: 13 }}>{s.label}</span>
                </div>
              );
            })}

            <div style={{ height: 1, background: THEME.border, margin: "18px 0" }} />

            {TOOLS.map((t, i) => {
              const pr = toolProg(i);
              return (
                <div key={i} style={{ opacity: pr, display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ color: THEME.accent, fontSize: 13 }}>✓</span>
                  <span style={{ color: THEME.muted, fontFamily: FONTS.mono, fontSize: 12 }}>{t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AppWindow>
    </SceneWrapper>
  );
};
