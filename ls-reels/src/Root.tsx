import React from "react";
import {
  Composition, Series, AbsoluteFill,
  useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import { T, F } from "./theme";
import { Slide, useCountUp, Grid, springIn } from "./helpers";

// ─── SVG Bag Icons ───────────────────────────────────────────────────────────

const PocheteSVG: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = T.accent }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 120 78" fill="none">
    <rect x="4" y="18" width="112" height="52" rx="14" stroke={color} strokeWidth="3" fill="none" />
    <rect x="14" y="22" width="42" height="44" rx="6" stroke={color} strokeWidth="2" fill="none" />
    <line x1="4" y1="44" x2="0" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="116" y1="44" x2="120" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="14" y1="32" x2="56" y2="32" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
    <circle cx="86" cy="44" r="8" stroke={color} strokeWidth="2" fill="none" />
    <line x1="86" y1="36" x2="86" y2="52" stroke={color} strokeWidth="1.5" />
    <line x1="78" y1="44" x2="94" y2="44" stroke={color} strokeWidth="1.5" />
  </svg>
);

const SlingBagSVG: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = T.accent }) => (
  <svg width={size * 0.7} height={size} viewBox="0 0 80 115" fill="none">
    <path d="M40 6 Q58 6 62 22" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <rect x="26" y="2" width="28" height="10" rx="4" stroke={color} strokeWidth="2" fill="none" />
    <rect x="5" y="22" width="70" height="88" rx="10" stroke={color} strokeWidth="3" fill="none" />
    <rect x="10" y="52" width="60" height="32" rx="6" stroke={color} strokeWidth="2" fill="none" />
    <line x1="10" y1="68" x2="70" y2="78" stroke={color} strokeWidth="1.5" />
    <line x1="10" y1="78" x2="70" y2="68" stroke={color} strokeWidth="1.5" />
    <line x1="10" y1="38" x2="70" y2="38" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
    <line x1="10" y1="46" x2="70" y2="46" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
  </svg>
);

const MessengerSVG: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = T.accent }) => (
  <svg width={size * 0.9} height={size} viewBox="0 0 90 100" fill="none">
    <path d="M10 8 Q45 0 80 8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="5" y="14" width="80" height="80" rx="10" stroke={color} strokeWidth="3" fill="none" />
    <rect x="12" y="20" width="34" height="28" rx="5" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="68" cy="36" r="10" stroke={color} strokeWidth="2" fill="none" />
    <line x1="61" y1="36" x2="75" y2="36" stroke={color} strokeWidth="1.5" />
    <line x1="5" y1="56" x2="85" y2="56" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
    <rect x="12" y="62" width="66" height="24" rx="5" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

const ToteSVG: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = T.accent }) => (
  <svg width={size * 1.2} height={size} viewBox="0 0 120 100" fill="none">
    <path d="M30 22 Q30 6 45 6 Q60 6 60 22" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M60 22 Q60 6 75 6 Q90 6 90 22" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M8 22 Q8 22 22 22 L98 22 Q112 22 112 22 L108 90 Q108 96 102 96 L18 96 Q12 96 12 90 Z" stroke={color} strokeWidth="3" fill="none" />
    <line x1="12" y1="50" x2="108" y2="50" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
    <line x1="60" y1="22" x2="60" y2="96" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
    <text x="60" y="76" textAnchor="middle" fill={color} fontSize="12" fontFamily="Georgia">coroa</text>
  </svg>
);

// ─── Scrolling Row ────────────────────────────────────────────────────────────

const BrandScrollRow: React.FC<{ brands: string[]; dir: 1 | -1; speed?: number; y?: number }> = ({
  brands, dir, speed = 1.0, y = 0,
}) => {
  const frame = useCurrentFrame();
  const doubled = [...brands, ...brands, ...brands];
  const itemW = 210;
  const totalW = brands.length * itemW;
  const raw = (frame * speed * dir);
  const offset = ((raw % totalW) + totalW) % totalW;

  return (
    <div style={{ overflow: "hidden", width: "100%", transform: `translateY(${y}px)` }}>
      <div style={{ display: "flex", transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {doubled.map((b, i) => (
          <div
            key={i}
            style={{
              width: itemW,
              flexShrink: 0,
              padding: "10px 0",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                background: T.ink,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "10px 18px",
                color: T.accent,
                fontFamily: F.ui,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                whiteSpace: "nowrap",
              }}
            >
              {b}
            </div>
            <div style={{ color: T.border, fontSize: 10 }}>✦</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BagScrollRow: React.FC<{ bags: React.ReactNode[]; dir: 1 | -1; speed?: number; y?: number }> = ({
  bags, dir, speed = 0.7, y = 0,
}) => {
  const frame = useCurrentFrame();
  const doubled = [...bags, ...bags, ...bags];
  const itemW = 160;
  const totalW = bags.length * itemW;
  const raw = frame * speed * dir;
  const offset = ((raw % totalW) + totalW) % totalW;
  const vertY = interpolate(frame, [0, 300], [0, -30], { extrapolateRight: "clamp" });

  return (
    <div style={{ overflow: "hidden", width: "100%", transform: `translateY(${y + vertY}px)` }}>
      <div style={{ display: "flex", transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {doubled.map((bag, i) => (
          <div
            key={i}
            style={{
              width: itemW,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
            }}
          >
            {bag}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── S1 — WhatsApp Chat ──────────────────────────────────────────────────────

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((frame - i * 6) / 7) * 0.5 + 0.5;
        const y = interpolate(bounce, [0, 1], [3, -3]);
        return (
          <div
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: T.accent,
              opacity: 0.6 + bounce * 0.4,
              transform: `translateY(${y}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

const S1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-15   : UI fades in
  // 10-40  : typing indicator visible
  // 38-55  : bubble slides in (spring)
  // 55-70  : bubble stays, pulses slightly
  // 65-85  : bubble morphs → bag pops out

  const uiFade = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const typingVisible = frame >= 10 && frame < 45;

  const bubblePr = spring({ frame: frame - 38, fps, config: { damping: 14, mass: 0.7 } });
  const bubbleVisible = frame >= 38;

  // Morph: bubble shrinks + fades, bag grows from same center
  const morphPr = spring({ frame: frame - 65, fps, config: { damping: 10, mass: 1.1 } });
  const bubbleScale = interpolate(morphPr, [0, 1], [1, 0.1]);
  const bubbleOpacity = interpolate(morphPr, [0, 0.6], [1, 0], { extrapolateRight: "clamp" });
  const bagScale = interpolate(morphPr, [0.2, 1], [0, 1], { extrapolateLeft: "clamp" });
  const bagOpacity = interpolate(morphPr, [0.2, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // bag bounces up slightly at the end
  const bagY = interpolate(morphPr, [0.7, 1], [0, -18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0B141A" }}>
      {/* WhatsApp wallpaper subtle pattern */}
      <AbsoluteFill style={{ opacity: 0.06 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="wp" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill={T.accent} />
              <circle cx="0" cy="0" r="1.5" fill={T.accent} />
              <circle cx="60" cy="0" r="1.5" fill={T.accent} />
              <circle cx="0" cy="60" r="1.5" fill={T.accent} />
              <circle cx="60" cy="60" r="1.5" fill={T.accent} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wp)" />
        </svg>
      </AbsoluteFill>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: "#1F2C34",
          padding: "52px 20px 16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: uiFade,
          zIndex: 10,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            background: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.ink,
            fontFamily: F.brand,
            fontWeight: 700,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          LS
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#E9EDEF", fontFamily: F.ui, fontSize: 18, fontWeight: 600 }}>LS Confex</div>
          <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 13, marginTop: 2 }}>online</div>
        </div>
        {/* Icons */}
        <div style={{ display: "flex", gap: 22, color: "#AEBAC1", fontSize: 20 }}>
          <span>📹</span>
          <span>📞</span>
          <span>⋮</span>
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          position: "absolute",
          top: 140,
          bottom: 90,
          left: 0,
          right: 0,
          padding: "20px 18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 10,
          opacity: uiFade,
        }}
      >
        {/* Typing indicator */}
        {typingVisible && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: T.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.ink,
                fontFamily: F.brand,
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              LS
            </div>
            <div
              style={{
                background: "#1F2C34",
                borderRadius: "18px 18px 18px 4px",
                padding: "12px 16px",
                border: "1px solid #2A3942",
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        {/* Message bubble */}
        {bubbleVisible && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              opacity: bubblePr,
              transform: `translateY(${interpolate(bubblePr, [0, 1], [30, 0])}px)`,
              position: "relative",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: T.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.ink,
                fontFamily: F.brand,
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
                alignSelf: "flex-end",
              }}
            >
              LS
            </div>

            {/* Bubble + Bag morph container */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              {/* The message bubble */}
              <div
                style={{
                  background: "#1F2C34",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "18px 22px",
                  border: "1px solid #2A3942",
                  maxWidth: 580,
                  transform: `scale(${bubbleScale})`,
                  opacity: bubbleOpacity,
                  transformOrigin: "left center",
                }}
              >
                <div
                  style={{
                    color: "#E9EDEF",
                    fontFamily: F.ui,
                    fontSize: 26,
                    lineHeight: 1.45,
                    fontWeight: 400,
                  }}
                >
                  Você sabia que a partir de{" "}
                  <span style={{ color: T.accent, fontWeight: 800, fontSize: 30 }}>20 unidades</span>{" "}
                  seu produto vira realidade? 🎒
                </div>
                <div
                  style={{
                    color: "#8696A0",
                    fontFamily: F.ui,
                    fontSize: 12,
                    marginTop: 8,
                    textAlign: "right",
                  }}
                >
                  agora ✓✓
                </div>
              </div>

              {/* Bag that pops from bubble */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: `translateY(calc(-50% + ${bagY}px)) scale(${bagScale})`,
                  opacity: bagOpacity,
                  transformOrigin: "left center",
                  filter: `drop-shadow(0 0 20px ${T.accent}88)`,
                }}
              >
                <SlingBagSVG size={220} color={T.accent} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1F2C34",
          padding: "12px 16px 28px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: uiFade,
        }}
      >
        <div style={{ fontSize: 22 }}>😊</div>
        <div
          style={{
            flex: 1,
            background: "#2A3942",
            borderRadius: 24,
            padding: "12px 18px",
            color: "#8696A0",
            fontFamily: F.ui,
            fontSize: 16,
          }}
        >
          Mensagem
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          🎤
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── S2 — Brands with scrolling bg ───────────────────────────────────────────

const BRAND_ROWS = [
  ["THUG NINE", "BOLOVO", "CARNAN", "DUBS", "ALFA", "COROA"],
  ["FLAMENGO", "VASCO", "SEABIRD", "DISTURB", "THUG NINE", "BOLOVO"],
  ["CARNAN", "COROA", "DUBS", "FLAMENGO", "VASCO", "SEABIRD"],
  ["ALFA", "DISTURB", "BOLOVO", "CARNAN", "THUG NINE", "COROA"],
  ["SEABIRD", "FLAMENGO", "VASCO", "DUBS", "DISTURB", "ALFA"],
];

const S2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerPr = spring({ frame, fps, config: { damping: 18 } });

  return (
    <Slide dur={dur} bg={T.accent}>
      {/* Scrolling brand rows in background */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, opacity: 0.18 }}>
        {BRAND_ROWS.map((row, i) => (
          <BrandScrollRow key={i} brands={row} dir={i % 2 === 0 ? 1 : -1} speed={0.6 + i * 0.1} />
        ))}
      </AbsoluteFill>

      {/* Foreground */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            opacity: headerPr,
            transform: `translateY(${interpolate(headerPr, [0, 1], [-20, 0])}px)`,
            color: T.ink,
            fontFamily: F.ui,
            fontSize: 46,
            fontWeight: 900,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          E é tanta marca<br />que confia na gente...
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {["THUG NINE", "BOLOVO", "CARNAN", "DUBS", "ALFA", "FLAMENGO", "VASCO", "COROA", "DISTURB", "SEABIRD", "+495", "..."].map((b, i) => {
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

// ─── S3 — Bag images scrolling ───────────────────────────────────────────────

const BAG_ROWS = [
  [<PocheteSVG size={90} />, <SlingBagSVG size={90} />, <MessengerSVG size={90} />, <ToteSVG size={90} />, <PocheteSVG size={90} />],
  [<ToteSVG size={80} />, <MessengerSVG size={80} />, <SlingBagSVG size={80} />, <PocheteSVG size={80} />, <ToteSVG size={80} />],
  [<SlingBagSVG size={100} />, <ToteSVG size={100} />, <PocheteSVG size={100} />, <MessengerSVG size={100} />, <SlingBagSVG size={100} />],
];

const S3: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = useCountUp(800, 10, 40);

  return (
    <Slide dur={dur}>
      {/* Scrolling bag rows in background */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", opacity: 0.12 }}>
        {BAG_ROWS.map((row, i) => (
          <BagScrollRow key={i} bags={row} dir={i % 2 === 0 ? 1 : -1} speed={0.5 + i * 0.15} />
        ))}
      </AbsoluteFill>

      <Grid />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 90, fontWeight: 900 }}>+{count}</div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 34, fontWeight: 700, marginTop: 4 }}>
          modelos já produzidos
        </div>
        <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>
          bolsas, mochilas, pochetes e acessórios
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 36 }}>
          {[PocheteSVG, SlingBagSVG, MessengerSVG, ToteSVG].map((BagComp, i) => {
            const pr = springIn(frame, fps, 20 + i * 5);
            return (
              <div
                key={i}
                style={{
                  opacity: pr,
                  transform: `scale(${interpolate(pr, [0, 1], [0.5, 1])})`,
                  width: 90,
                  height: 90,
                  background: T.surface2,
                  border: `1px solid ${T.accent}40`,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BagComp size={54} />
              </div>
            );
          })}
        </div>
      </div>
    </Slide>
  );
};

// ─── S4 — Pergunta ────────────────────────────────────────────────────────────

const S4: React.FC<{ dur: number }> = ({ dur }) => (
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

// ─── S5 — Resposta (cards lado a lado, maiores) ───────────────────────────────

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
        <div
          style={{
            color: T.white,
            fontFamily: F.ui,
            fontSize: 38,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 36,
          }}
        >
          Porque é <span style={{ color: T.accent }}>simples</span>, premium e sob medida.
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center" }}>
          {cards.map((c, i) => {
            const pr = springIn(frame, fps, 12 + i * 10);
            return (
              <div
                key={i}
                style={{
                  opacity: pr,
                  transform: `translateY(${interpolate(pr, [0, 1], [40, 0])}px)`,
                  background: T.surface2,
                  border: `2px solid ${i === 1 ? T.accent : T.border}`,
                  borderRadius: 20,
                  padding: "30px 22px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  flex: 1,
                  maxWidth: 280,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: i === 1 ? T.accent : T.surface,
                    border: `2px solid ${i === 1 ? T.accent : T.border}`,
                    color: i === 1 ? T.ink : T.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 800,
                  }}
                >
                  {c.icon}
                </div>
                <div style={{ color: T.white, fontFamily: F.ui, fontSize: 26, fontWeight: 800 }}>{c.t}</div>
                <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 16 }}>{c.d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Slide>
  );
};

// ─── S6 — Prova social ────────────────────────────────────────────────────────

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

// ─── S7 — CTA (texto atualizado) ─────────────────────────────────────────────

const S7: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 9) * 0.03;
  return (
    <Slide dur={dur} bg={T.accent}>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.ink, fontFamily: F.ui, fontSize: 46, fontWeight: 900, lineHeight: 1.15 }}>
          Está esperando o quê<br />para produzir seus<br />acessórios?
        </div>
        <div
          style={{
            marginTop: 40,
            transform: `scale(${pulse})`,
            background: T.ink,
            color: T.accent,
            fontFamily: F.ui,
            fontSize: 22,
            fontWeight: 800,
            padding: "18px 36px",
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

// ─── S8 — Logo + contato (info atualizada) ───────────────────────────────────

const S8: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = springIn(frame, fps, 4);
  return (
    <Slide dur={dur}>
      <Grid />
      <div
        style={{
          position: "relative",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
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
          <span style={{ color: T.muted, fontFamily: F.mono, fontSize: 17 }}>🌐 lsconfex.com.br</span>
          <span style={{ color: T.muted, fontFamily: F.mono, fontSize: 17 }}>📸 @lsconfex</span>
        </div>
      </div>
    </Slide>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const D = { s1: 90, s2: 95, s3: 90, s4: 75, s5: 110, s6: 80, s7: 90, s8: 110 };
export const TOTAL = Object.values(D).reduce((a, b) => a + b, 0);

const Main: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    {/* <Audio src={staticFile("music.mp3")} volume={1} placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> */}
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

export const RemotionRoot: React.FC = () => (
  <Composition id="LSReels" component={Main} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
