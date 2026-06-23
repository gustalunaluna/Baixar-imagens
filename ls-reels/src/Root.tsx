import React from "react";
import {
  Composition, Series, AbsoluteFill, Audio, staticFile,
  useCurrentFrame, useVideoConfig, interpolate,
} from "remotion";
import { T, F } from "./theme";
import { Slide, useCountUp, Grid, springIn } from "./helpers";

const S1: React.FC<{ dur: number }> = ({ dur }) => {
  const count = useCountUp(20, 12, 36);
  return (
    <Slide dur={dur}>
      <Grid />
      <div style={{ position: "relative" }}>
        <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 30, marginBottom: 10 }}>Você sabia que</div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 56, fontWeight: 800, lineHeight: 1.05 }}>
          a partir de
        </div>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 110, fontWeight: 900, lineHeight: 1, margin: "6px 0" }}>
          {count} un.
        </div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 30, fontWeight: 600 }}>
          a sua marca já vira realidade?
        </div>

        <div
          style={{
            marginTop: 40,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "22px 26px",
            display: "inline-flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 30 }}>
            <span style={{ fontSize: 26 }}>🛍️</span>
            <span style={{ color: T.accent, fontFamily: F.ui, fontSize: 16, fontWeight: 700 }}>+500 marcas</span>
          </div>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 40, fontWeight: 800 }}>20</div>
          <div style={{ color: T.dim, fontFamily: F.ui, fontSize: 14 }}>pedido mínimo</div>
        </div>
      </div>
    </Slide>
  );
};

const S2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brands = ["THUG NINE", "BOLOVO", "CARNAN", "DUBS", "ALFA", "FLAMENGO", "VASCO", "COROA", "DISTURB", "SEABIRD", "+495", "..."];
  return (
    <Slide dur={dur} bg={T.accent}>
      <div style={{ position: "relative" }}>
        <div style={{ color: T.ink, fontFamily: F.ui, fontSize: 46, fontWeight: 900, marginBottom: 24, textAlign: "center" }}>
          E é tanta marca<br />que confia na gente...
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {brands.map((b, i) => {
            const pr = springIn(frame, fps, 8 + i * 3);
            return (
              <div
                key={i}
                style={{
                  opacity: pr,
                  transform: `scale(${interpolate(pr, [0, 1], [0.7, 1])})`,
                  background: T.ink,
                  borderRadius: 10,
                  padding: "16px 8px",
                  textAlign: "center",
                  color: T.accent,
                  fontFamily: F.ui,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </div>
    </Slide>
  );
};

const S3: React.FC<{ dur: number }> = ({ dur }) => {
  const count = useCountUp(800, 10, 40);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Slide dur={dur}>
      <Grid />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 90, fontWeight: 900 }}>+{count}</div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 34, fontWeight: 700, marginTop: 4 }}>
          modelos já produzidos
        </div>
        <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>
          bolsas, mochilas, pochetes e acessórios
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 36 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const pr = springIn(frame, fps, 20 + i * 4);
            return (
              <div
                key={i}
                style={{
                  opacity: pr,
                  width: 70,
                  height: 70,
                  background: T.surface2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="34" height="30" viewBox="0 0 38 34" fill="none">
                  <rect x="6" y="11" width="26" height="20" rx="3" stroke={T.accent} strokeWidth="2" />
                  <path d="M12 11 Q12 4 19 4 Q26 4 26 11" stroke={T.accent} strokeWidth="2" fill="none" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </Slide>
  );
};

const S4: React.FC<{ dur: number }> = ({ dur }) => {
  return (
    <Slide dur={dur} bg={T.surface}>
      <Grid />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 52, fontWeight: 800, lineHeight: 1.15 }}>
          Por que tanta<br />marca escolhe<br />
          <span style={{ color: T.accent }}>produzir com a LS?</span>
        </div>
        <div style={{ marginTop: 30, fontSize: 60 }}>🤔</div>
      </div>
    </Slide>
  );
};

const S5: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cards = [
    { t: "Simples", d: "Você cuida da marca, a gente da produção", icon: "✓" },
    { t: "Premium", d: "Materiais de qualidade e acabamento", icon: "★" },
    { t: "Sob medida", d: "Bordado, silk e cores da sua marca", icon: "✦" },
  ];
  return (
    <Slide dur={dur}>
      <div style={{ position: "relative" }}>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 42, fontWeight: 800, textAlign: "center", marginBottom: 36 }}>
          Porque é <span style={{ color: T.accent }}>simples</span>, premium e sob medida.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {cards.map((c, i) => {
            const pr = springIn(frame, fps, 12 + i * 10);
            return (
              <div
                key={i}
                style={{
                  opacity: pr,
                  transform: `translateX(${interpolate(pr, [0, 1], [-40, 0])}px)`,
                  background: T.surface2,
                  border: `1px solid ${i === 1 ? T.accent : T.border}`,
                  borderRadius: 16,
                  padding: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: T.accent,
                    color: T.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <div style={{ color: T.white, fontFamily: F.ui, fontSize: 26, fontWeight: 800 }}>{c.t}</div>
                  <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 17 }}>{c.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Slide>
  );
};

const S6: React.FC<{ dur: number }> = ({ dur }) => {
  const count = useCountUp(10, 10, 36);
  return (
    <Slide dur={dur} bg={T.surface}>
      <Grid />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 100, fontWeight: 900 }}>+{count} anos</div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 30, fontWeight: 700, marginTop: 6 }}>
          de mercado e experiência
        </div>
        <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>
          As marcas já sabem disso. 🔥
        </div>
      </div>
    </Slide>
  );
};

const S7: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 9) * 0.03;
  return (
    <Slide dur={dur} bg={T.accent}>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.ink, fontFamily: F.ui, fontSize: 48, fontWeight: 900, lineHeight: 1.15 }}>
          Está esperando<br />o quê para criar<br />a sua marca?
        </div>
        <div
          style={{
            marginTop: 40,
            transform: `scale(${pulse})`,
            background: T.ink,
            color: T.accent,
            fontFamily: F.ui,
            fontSize: 24,
            fontWeight: 800,
            padding: "20px 40px",
            borderRadius: 32,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          💬 Chamar no WhatsApp
        </div>
      </div>
    </Slide>
  );
};

const S8: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = springIn(frame, fps, 4);
  return (
    <Slide dur={dur}>
      <Grid />
      <div style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div
          style={{
            opacity: logo,
            transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`,
            width: 110,
            height: 110,
            borderRadius: 26,
            border: `3px solid ${T.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.accent,
            fontFamily: F.brand,
            fontWeight: 700,
            fontSize: 52,
          }}
        >
          LS
        </div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 38, fontWeight: 800 }}>LS CONFECÇÕES</div>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
          SUA MARCA. NOSSA PRODUÇÃO.
        </div>
        <div
          style={{
            marginTop: 16,
            background: T.surface2,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "18px 30px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span style={{ color: T.white, fontFamily: F.mono, fontSize: 20 }}>💬 (11) 99937-0418</span>
          <span style={{ color: T.muted, fontFamily: F.mono, fontSize: 17 }}>🌐 www.lsconfex.com.br</span>
          <span style={{ color: T.muted, fontFamily: F.mono, fontSize: 17 }}>📸 @lsconfex</span>
        </div>
      </div>
    </Slide>
  );
};

const D = { s1: 90, s2: 95, s3: 90, s4: 75, s5: 110, s6: 80, s7: 90, s8: 110 };
export const TOTAL = Object.values(D).reduce((a, b) => a + b, 0); // 740 frames ≈ 24.7s

const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, fps], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - fps * 2, durationInFrames], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const volume = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Coloque public/music.mp3 para ativar o áudio */}
      {/* <Audio src={staticFile("music.mp3")} volume={volume} placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> */}
      <Series>
        <Series.Sequence durationInFrames={D.s1}><S1 dur={D.s1} /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s2}><S2 dur={D.s2} /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s3}><S3 dur={D.s3} /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s4}><S4 dur={D.s4} /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s5}><S5 dur={D.s5} /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s6}><S6 dur={D.s6} /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s7}><S7 dur={D.s7} /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s8}><S8 dur={D.s8} /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="LSReels" component={Main} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
