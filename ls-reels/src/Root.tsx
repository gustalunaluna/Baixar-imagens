import React from "react";
import {
  Composition, Series, AbsoluteFill,
  useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import { T, F } from "./theme";
import { Slide, useCountUp, Grid, springIn } from "./helpers";

// ─── SVG Bag Icons ────────────────────────────────────────────────────────────

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
    <path d="M8 22 L22 22 L98 22 L112 22 L108 90 Q108 96 102 96 L18 96 Q12 96 12 90 Z" stroke={color} strokeWidth="3" fill="none" />
    <line x1="12" y1="50" x2="108" y2="50" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
    <line x1="60" y1="22" x2="60" y2="96" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
    <text x="60" y="76" textAnchor="middle" fill={color} fontSize="12" fontFamily="Georgia">coroa</text>
  </svg>
);

// ─── Cinematic Utilities ──────────────────────────────────────────────────────

// Fundo atmosférico com glow radial animado (parallax lento)
const AtmosphericBg: React.FC<{ color?: string; intensity?: number }> = ({
  color = T.accent,
  intensity = 0.18,
}) => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 70) * 12;
  const y = 50 + Math.cos(frame / 90) * 9;
  const x2 = 30 + Math.cos(frame / 110) * 15;
  const y2 = 70 + Math.sin(frame / 80) * 10;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Glow principal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 65% 45% at ${x}% ${y}%, ${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />
      {/* Glow secundário menor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 35% 25% at ${x2}% ${y2}%, ${color}18 0%, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Flash de luz — curto e intenso
const GlowFlash: React.FC<{ startFrame: number; color?: string; duration?: number }> = ({
  startFrame,
  color = "#ffffff",
  duration = 8,
}) => {
  const frame = useCurrentFrame();
  const mid = duration / 2;
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + mid, startFrame + duration],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{
        background: color,
        opacity,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};

// Brilho passando (light sweep)
const LightSweep: React.FC<{ startFrame: number; delay?: number }> = ({ startFrame, delay = 0 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame + delay, startFrame + delay + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(progress, [0, 1], [-30, 130]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent ${x - 12}%, rgba(255,255,255,0.12) ${x}%, rgba(255,255,255,0.06) ${x + 4}%, transparent ${x + 18}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Partículas geométricas que explodem de um ponto
const BurstParticles: React.FC<{ startFrame: number; x?: string; y?: string; count?: number; color?: string }> = ({
  startFrame, x = "50%", y = "50%", count = 10, color = T.accent,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: y }}>
        {Array.from({ length: count }).map((_, i) => {
          const angle = (i / count) * Math.PI * 2;
          const delay = i * 1.5;
          const progress = interpolate(frame, [startFrame + delay, startFrame + delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const dist = interpolate(progress, [0, 0.6, 1], [0, 110, 140]);
          const opacity = interpolate(progress, [0, 0.2, 0.7, 1], [0, 1, 0.6, 0]);
          const size = i % 3 === 0 ? 7 : i % 3 === 1 ? 5 : 9;
          const isSquare = i % 2 === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: isSquare ? 2 : "50%",
                background: color,
                opacity,
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${progress * 180}deg)`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Anel de glow que expande
const GlowRing: React.FC<{ startFrame: number; x?: string; y?: string; color?: string }> = ({
  startFrame, x = "50%", y = "50%", color = T.accent,
}) => {
  const frame = useCurrentFrame();
  const pr = spring({ frame: frame - startFrame, fps: 30, config: { damping: 18, mass: 0.7 } });
  const size = interpolate(pr, [0, 1], [40, 380]);
  const opacity = interpolate(pr, [0, 0.3, 1], [0, 0.7, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          transform: "translate(-50%, -50%)",
          opacity,
          boxShadow: `0 0 ${size * 0.15}px ${color}66`,
        }}
      />
    </AbsoluteFill>
  );
};


// ─── Scrolling Rows ───────────────────────────────────────────────────────────

const BrandScrollRow: React.FC<{ brands: string[]; dir: 1 | -1; speed?: number; y?: number }> = ({
  brands, dir, speed = 1.0, y = 0,
}) => {
  const frame = useCurrentFrame();
  const doubled = [...brands, ...brands, ...brands];
  const itemW = 210;
  const totalW = brands.length * itemW;
  const offset = (((frame * speed * dir) % totalW) + totalW) % totalW;
  return (
    <div style={{ overflow: "hidden", width: "100%", transform: `translateY(${y}px)` }}>
      <div style={{ display: "flex", transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {doubled.map((b, i) => (
          <div key={i} style={{ width: itemW, flexShrink: 0, padding: "10px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: T.ink, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 18px", color: T.accent, fontFamily: F.ui, fontSize: 13, fontWeight: 800, letterSpacing: 1, whiteSpace: "nowrap" }}>
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
  const offset = (((frame * speed * dir) % totalW) + totalW) % totalW;
  const vertY = interpolate(frame, [0, 300], [0, -30], { extrapolateRight: "clamp" });
  return (
    <div style={{ overflow: "hidden", width: "100%", transform: `translateY(${y + vertY}px)` }}>
      <div style={{ display: "flex", transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {doubled.map((bag, i) => (
          <div key={i} style={{ width: itemW, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 20px" }}>
            {bag}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── S1 — WhatsApp com morph cinematográfico ──────────────────────────────────

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((frame - i * 6) / 7) * 0.5 + 0.5;
        const y = interpolate(bounce, [0, 1], [3, -3]);
        return (
          <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: T.accent, opacity: 0.6 + bounce * 0.4, transform: `translateY(${y}px)` }} />
        );
      })}
    </div>
  );
};

const S1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Timeline (150 frames / 5s) — ritmo lento e cinematográfico ──
  // 0–20   : UI fades in suavemente
  // 18–70  : typing dots (digitando por mais tempo)
  // 65–95  : balão entra com bounce + salta levemente ao receber
  // 95–110 : balão repousa, pre-glow acumula
  // 108–116: FLASH
  // 114–134: mochila emerge (blur→sharp + rotação + spring)
  // 116–138: anel de glow + partículas
  // 128–150: mochila flutua + light sweep

  const uiFade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const typingVisible = frame >= 18 && frame < 72;
  const bubbleVisible = frame >= 65;

  // Bounce ao receber: spring com overshoot (damping baixo = mais bounce)
  // Vem de baixo (60px), sobe, ultrapassa um pouco (-20px), depois assenta
  const bounceSpring = spring({ frame: frame - 65, fps, config: { damping: 7, mass: 0.75, stiffness: 160 } });
  const bubbleY = interpolate(bounceSpring, [0, 1], [60, 0]);
  // Pequeno salto extra: sobe e volta — como WhatsApp "pula" ao receber
  const jumpExtra = spring({ frame: frame - 68, fps, config: { damping: 5, mass: 0.5, stiffness: 280 } });
  const bubbleJump = interpolate(jumpExtra, [0, 0.25, 0.55, 1], [0, -22, -6, 0]);
  const bubbleOpacityIn = interpolate(frame, [65, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pre-flash: balão pulsa levemente antes do morph
  const prePulse = interpolate(frame, [100, 108], [1, 1.035], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const preGlow = interpolate(frame, [100, 108], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Morph (a partir do frame 108)
  // Fase 1: squish horizontal como borracha
  const squishX = interpolate(frame, [108, 116], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const squishY = interpolate(frame, [108, 116], [1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Fase 2: contrai até zero
  const contractScale = interpolate(frame, [116, 124], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubbleScaleX = squishX * contractScale;
  const bubbleScaleY = squishY * contractScale;
  const bubbleOpacity = interpolate(frame, [112, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubbleRadius = interpolate(frame, [108, 116], [28, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Mochila: spring elástico + blur→sharp + rotação de entrada
  const bagSpring = spring({ frame: frame - 114, fps, config: { damping: 10, mass: 1.1, stiffness: 130 } });
  const bagScale = interpolate(bagSpring, [0, 1], [0, 1]);
  const bagOpacity = interpolate(bagSpring, [0, 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagBlur = interpolate(bagSpring, [0, 0.65], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagRotate = interpolate(bagSpring, [0, 0.7], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagFloat = interpolate(frame, [132, 150], [0, -18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagGlowSize = interpolate(bagSpring, [0.5, 1], [0, 34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const showMorphEffects = frame >= 108;

  return (
    <AbsoluteFill style={{ background: "#0B141A", overflow: "hidden" }}>
      <AtmosphericBg color={T.accent} intensity={0.12} />

      {/* Wallpaper pontilhado */}
      <AbsoluteFill style={{ opacity: 0.07 }}>
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
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "#1F2C34", padding: "52px 20px 16px", display: "flex", alignItems: "center", gap: 16, opacity: uiFade, zIndex: 10 }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", color: T.ink, fontFamily: F.brand, fontWeight: 700, fontSize: 22, flexShrink: 0 }}>LS</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#E9EDEF", fontFamily: F.ui, fontSize: 18, fontWeight: 600 }}>LS Confex</div>
          <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 13, marginTop: 2 }}>online</div>
        </div>
        <div style={{ display: "flex", gap: 22, color: "#AEBAC1", fontSize: 20 }}><span>📹</span><span>📞</span><span>⋮</span></div>
      </div>

      {/* Chat area */}
      <div style={{ position: "absolute", top: 140, bottom: 90, left: 0, right: 0, padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 16, opacity: uiFade }}>

        {/* Typing indicator */}
        {typingVisible && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", color: T.ink, fontFamily: F.brand, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>LS</div>
            <div style={{ background: "#1F2C34", borderRadius: "28px 28px 28px 6px", padding: "16px 22px", border: "1px solid #2A3942" }}>
              <TypingDots />
            </div>
          </div>
        )}

        {/* Message bubble com bounce */}
        {bubbleVisible && (
          <div
            style={{
              display: "flex", alignItems: "flex-end", gap: 12, width: "100%",
              opacity: bubbleOpacityIn,
              // Bounce: vem de baixo + salta levemente ao "receber"
              transform: `translateY(${bubbleY + bubbleJump}px)`,
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 22, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", color: T.ink, fontFamily: F.brand, fontWeight: 700, fontSize: 16, flexShrink: 0, alignSelf: "flex-end", opacity: bubbleOpacity }}>LS</div>

            <div style={{ position: "relative", flex: 1 }}>
              {/* Balão */}
              <div
                style={{
                  background: "#1F2C34",
                  borderRadius: bubbleRadius,
                  padding: "26px 30px",
                  border: "1px solid #2A3942",
                  transform: `scaleX(${bubbleScaleX}) scaleY(${bubbleScaleY}) scale(${prePulse})`,
                  transformOrigin: "left center",
                  opacity: bubbleOpacity,
                  boxShadow: preGlow > 0 ? `0 0 ${preGlow * 44}px ${T.accent}55` : "none",
                }}
              >
                <div style={{ color: "#E9EDEF", fontFamily: F.ui, fontSize: 34, lineHeight: 1.5, fontWeight: 400 }}>
                  Você sabia que a partir de{" "}
                  <span style={{ color: T.accent, fontWeight: 800, fontSize: 40 }}>20 unidades</span>{" "}
                  seu produto vira realidade? 🎒
                </div>
                <div style={{ color: "#8696A0", fontFamily: F.ui, fontSize: 16, marginTop: 12, textAlign: "right" }}>agora ✓✓</div>
              </div>

              {/* Efeitos de morph */}
              {showMorphEffects && (
                <>
                  <GlowRing startFrame={116} x="40%" y="50%" color={T.accent} />
                  <BurstParticles startFrame={118} x="40%" y="50%" count={12} color={T.accent} />
                  <div
                    style={{
                      position: "absolute", left: "50%", top: "50%",
                      transform: `translate(-50%, calc(-50% + ${bagFloat}px)) scale(${bagScale}) rotate(${bagRotate}deg)`,
                      opacity: bagOpacity,
                      filter: `blur(${bagBlur}px) drop-shadow(0 0 ${bagGlowSize}px ${T.accent}cc)`,
                      transformOrigin: "center center",
                    }}
                  >
                    <SlingBagSVG size={280} color={T.accent} />
                  </div>
                  {frame >= 130 && <LightSweep startFrame={130} />}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Flash do morph */}
      <GlowFlash startFrame={108} color={`${T.accent}99`} duration={12} />
      <GlowFlash startFrame={112} color="#ffffff" duration={7} />

      {/* Input bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#1F2C34", padding: "12px 16px 28px", display: "flex", alignItems: "center", gap: 12, opacity: uiFade }}>
        <div style={{ fontSize: 22 }}>😊</div>
        <div style={{ flex: 1, background: "#2A3942", borderRadius: 24, padding: "12px 18px", color: "#8696A0", fontFamily: F.ui, fontSize: 16 }}>Mensagem</div>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎤</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── S2 — Brands ─────────────────────────────────────────────────────────────

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

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, opacity: 0.18 }}>
        {BRAND_ROWS.map((row, i) => (
          <BrandScrollRow key={i} brands={row} dir={i % 2 === 0 ? 1 : -1} speed={0.6 + i * 0.1} />
        ))}
      </AbsoluteFill>
      <div style={{ position: "relative" }}>
        <div style={{ opacity: headerPr, transform: `translateY(${interpolate(headerPr, [0, 1], [-20, 0])}px)`, color: T.ink, fontFamily: F.ui, fontSize: 46, fontWeight: 900, marginBottom: 24, textAlign: "center" }}>
          E é tanta marca<br />que confia na gente...
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {["THUG NINE", "BOLOVO", "CARNAN", "DUBS", "ALFA", "FLAMENGO", "VASCO", "COROA", "DISTURB", "SEABIRD", "+495", "..."].map((b, i) => {
            const pr = springIn(frame, fps, 8 + i * 3);
            return (
              <div key={i} style={{ opacity: pr, transform: `scale(${interpolate(pr, [0, 1], [0.7, 1])})`, background: T.ink, borderRadius: 10, padding: "16px 8px", textAlign: "center", color: T.accent, fontFamily: F.ui, fontSize: 15, fontWeight: 800 }}>
                {b}
              </div>
            );
          })}
        </div>
      </div>
    </Slide>
  );
};

// ─── S3 — Bag models ─────────────────────────────────────────────────────────

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

      <AtmosphericBg intensity={0.14} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", opacity: 0.12 }}>
        {BAG_ROWS.map((row, i) => (
          <BagScrollRow key={i} bags={row} dir={i % 2 === 0 ? 1 : -1} speed={0.5 + i * 0.15} />
        ))}
      </AbsoluteFill>
      <Grid />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 90, fontWeight: 900 }}>+{count}</div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 34, fontWeight: 700, marginTop: 4 }}>modelos já produzidos</div>
        <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>bolsas, mochilas, pochetes e acessórios</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 36 }}>
          {[PocheteSVG, SlingBagSVG, MessengerSVG, ToteSVG].map((BagComp, i) => {
            const pr = springIn(frame, fps, 20 + i * 5);
            return (
              <div key={i} style={{ opacity: pr, transform: `scale(${interpolate(pr, [0, 1], [0.5, 1])})`, width: 90, height: 90, background: T.surface2, border: `1px solid ${T.accent}40`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

    <AtmosphericBg intensity={0.13} />
    <Grid />
    <div style={{ position: "relative", textAlign: "center" }}>
      <div style={{ color: T.white, fontFamily: F.ui, fontSize: 52, fontWeight: 800, lineHeight: 1.15 }}>
        Por que tanta<br />marca escolhe<br /><span style={{ color: T.accent }}>produzir com a LS?</span>
      </div>
      <div style={{ marginTop: 30, fontSize: 60 }}>🤔</div>
    </div>
  </Slide>
);

// ─── S5 — Resposta ────────────────────────────────────────────────────────────

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
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 38, fontWeight: 800, textAlign: "center", marginBottom: 36 }}>
          Porque é <span style={{ color: T.accent }}>simples</span>, premium e sob medida.
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center" }}>
          {cards.map((c, i) => {
            const pr = springIn(frame, fps, 12 + i * 10);
            return (
              <div key={i} style={{ opacity: pr, transform: `translateY(${interpolate(pr, [0, 1], [40, 0])}px)`, background: T.surface2, border: `2px solid ${i === 1 ? T.accent : T.border}`, borderRadius: 20, padding: "30px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flex: 1, maxWidth: 280, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: i === 1 ? T.accent : T.surface, border: `2px solid ${i === 1 ? T.accent : T.border}`, color: i === 1 ? T.ink : T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>
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

      <AtmosphericBg intensity={0.16} />
      <Grid />
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 100, fontWeight: 900 }}>+{count} anos</div>
        <div style={{ color: T.white, fontFamily: F.ui, fontSize: 30, fontWeight: 700, marginTop: 6 }}>de mercado e experiência</div>
        <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>As marcas já sabem disso. 🔥</div>
      </div>
    </Slide>
  );
};

// ─── S7 — CTA ────────────────────────────────────────────────────────────────

const S7: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 9) * 0.03;
  return (
    <Slide dur={dur} bg={T.accent}>

      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ color: T.ink, fontFamily: F.ui, fontSize: 46, fontWeight: 900, lineHeight: 1.15 }}>
          Está esperando o quê<br />para produzir seus<br />acessórios?
        </div>
        <div style={{ marginTop: 40, transform: `scale(${pulse})`, background: T.ink, color: T.accent, fontFamily: F.ui, fontSize: 22, fontWeight: 800, padding: "18px 36px", borderRadius: 32, display: "inline-flex", alignItems: "center", gap: 12 }}>
          💬 Chamar no WhatsApp
        </div>
      </div>
    </Slide>
  );
};

// ─── S8 — Logo cinematográfico ────────────────────────────────────────────────

const S8: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Revelação cinematográfica:
  // 0–8   : flash de entrada
  // 0–16  : partículas convergem ao centro
  // 10–28 : logo emerge com blur→sharp + scale
  // 22–36 : light sweep passa pelo logo
  // 30–50 : texto aparece vindo de baixo
  // 40–dur: oscilação suave de escala (respiração)

  // Partículas convergindo (de fora para dentro)
  const convergeProgress = (i: number) => {
    const delay = i * 2;
    return spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6 } });
  };

  // Logo
  const logoPr = spring({ frame: frame - 10, fps, config: { damping: 13, mass: 0.9 } });
  const logoScale = interpolate(logoPr, [0, 1], [0.5, 1]);
  const logoBlur = interpolate(logoPr, [0, 0.7], [16, 0], { extrapolateRight: "clamp" });
  const logoOpacity = interpolate(logoPr, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Respiração suave depois de aparecer
  const breathe = 1 + Math.sin(frame / 18) * 0.018;

  // Glow do logo
  const logoGlow = interpolate(logoPr, [0.6, 1], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Texto
  const textPr = spring({ frame: frame - 30, fps, config: { damping: 16, mass: 0.7 } });
  const textY = interpolate(textPr, [0, 1], [28, 0]);
  const textOp = interpolate(textPr, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Contato card
  const cardPr = spring({ frame: frame - 50, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: T.bg }}>

      <AtmosphericBg intensity={0.22} />
      <Grid />

      {/* Partículas geométricas convergindo para o centro */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          const pr = convergeProgress(i);
          const dist = interpolate(pr, [0, 1], [500, 0]);
          const opacity = interpolate(pr, [0, 0.1, 0.8, 1], [0, 1, 0.8, 0]);
          const size = i % 3 === 0 ? 8 : 5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "35%",
                width: size,
                height: size,
                borderRadius: i % 2 === 0 ? "50%" : 2,
                background: T.accent,
                opacity,
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Flash na entrada */}
      <GlowFlash startFrame={8} color={`${T.accent}88`} duration={8} />
      <GlowFlash startFrame={10} color="#ffffff" duration={5} />

      {/* Anel de glow no logo */}
      <GlowRing startFrame={18} x="50%" y="35%" color={T.accent} />
      <BurstParticles startFrame={10} x="50%" y="35%" count={8} color={T.accent} />

      {/* Light sweep */}
      <LightSweep startFrame={22} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale * breathe})`,
            filter: `blur(${logoBlur}px) drop-shadow(0 0 ${logoGlow}px ${T.accent}cc)`,
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

        {/* Texto revelado pela luz */}
        <div
          style={{
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 38, fontWeight: 800 }}>LS CONFECÇÕES</div>
          <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
            SUA MARCA. NOSSA PRODUÇÃO.
          </div>
        </div>

        {/* Segundo light sweep no texto */}
        <LightSweep startFrame={42} />

        {/* Card de contato */}
        <div
          style={{
            opacity: cardPr,
            transform: `translateY(${interpolate(cardPr, [0, 1], [20, 0])}px)`,
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const D = { s1: 150, s2: 95, s3: 90, s4: 75, s5: 110, s6: 80, s7: 90, s8: 110 };
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
