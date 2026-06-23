import React from "react";
import {
  Composition, Series, AbsoluteFill,
  useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import { T, F } from "./theme";
import { useCountUp, springIn } from "./helpers";

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

const AtmosphericBg: React.FC<{ color?: string; intensity?: number }> = ({
  color = "#000000",
  intensity = 0.10,
}) => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 70) * 12;
  const y = 50 + Math.cos(frame / 90) * 9;
  const x2 = 30 + Math.cos(frame / 110) * 15;
  const y2 = 70 + Math.sin(frame / 80) * 10;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 45% at ${x}% ${y}%, ${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 35% 25% at ${x2}% ${y2}%, ${color}18 0%, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

const GlowFlash: React.FC<{ startFrame: number; color?: string; duration?: number }> = ({
  startFrame, color = "#ffffff", duration = 8,
}) => {
  const frame = useCurrentFrame();
  const mid = duration / 2;
  const opacity = interpolate(frame, [startFrame, startFrame + mid, startFrame + duration], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: color, opacity, pointerEvents: "none", mixBlendMode: "screen" }} />;
};

const LightSweep: React.FC<{ startFrame: number; delay?: number }> = ({ startFrame, delay = 0 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame + delay, startFrame + delay + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(progress, [0, 1], [-30, 130]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${x - 12}%, rgba(255,255,255,0.12) ${x}%, rgba(255,255,255,0.06) ${x + 4}%, transparent ${x + 18}%)` }} />
    </AbsoluteFill>
  );
};

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
          const progress = interpolate(frame, [startFrame + delay, startFrame + delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const dist = interpolate(progress, [0, 0.6, 1], [0, 110, 140]);
          const opacity = interpolate(progress, [0, 0.2, 0.7, 1], [0, 1, 0.6, 0]);
          const size = i % 3 === 0 ? 7 : i % 3 === 1 ? 5 : 9;
          return (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: i % 2 === 0 ? 2 : "50%", background: color, opacity, transform: `translate(-50%, -50%) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${progress * 180}deg)` }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const GlowRing: React.FC<{ startFrame: number; x?: string; y?: string; color?: string }> = ({
  startFrame, x = "50%", y = "50%", color = T.accent,
}) => {
  const frame = useCurrentFrame();
  const pr = spring({ frame: frame - startFrame, fps: 30, config: { damping: 18, mass: 0.7 } });
  const size = interpolate(pr, [0, 1], [40, 380]);
  const opacity = interpolate(pr, [0, 0.3, 1], [0, 0.7, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", border: `2px solid ${color}`, transform: "translate(-50%, -50%)", opacity, boxShadow: `0 0 ${size * 0.15}px ${color}66` }} />
    </AbsoluteFill>
  );
};

// ─── Grain Overlay ────────────────────────────────────────────────────────────

const GRAIN_URL = `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="gf"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(#gf)" opacity="0.12"/></svg>`)}`;

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 95, backgroundImage: `url("${GRAIN_URL}")`, backgroundSize: "200px 200px", backgroundPosition: `${(f * 53) % 200}px ${(f * 37) % 200}px`, opacity: 0.55, mixBlendMode: "overlay" }} />
  );
};

// ─── Inline Grid (unique ID per scene) ───────────────────────────────────────

const InlineGrid: React.FC<{ id: string; dark?: boolean }> = ({ id, dark = false }) => (
  <AbsoluteFill style={{ opacity: 0.07, pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
          <rect x="20" y="20" width="40" height="40" fill="none" stroke={dark ? "#fff" : "#000"} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  </AbsoluteFill>
);

// ─── Scene Transition Flash ───────────────────────────────────────────────────

const SceneTrans: React.FC<{ dur: number; tf?: number; color?: string; entry?: boolean; exit?: boolean }> = ({
  dur, tf = 12, color = T.accent, entry = true, exit = true,
}) => {
  const frame = useCurrentFrame();
  const inOp  = entry ? interpolate(frame, [0, tf], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const outOp = exit  ? interpolate(frame, [dur - tf, dur - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <>
      {inOp  > 0.01 && <AbsoluteFill style={{ background: color, opacity: inOp,  pointerEvents: "none", zIndex: 200 }} />}
      {outOp > 0.01 && <AbsoluteFill style={{ background: color, opacity: outOp, pointerEvents: "none", zIndex: 200 }} />}
    </>
  );
};

// ─── Scrolling Rows ───────────────────────────────────────────────────────────

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
          <div key={i} style={{ width: itemW, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 20px" }}>{bag}</div>
        ))}
      </div>
    </div>
  );
};

// ─── S1 — App window reveal + satellite windows merge ────────────────────────

const SatBorder: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <>
    <div style={{ position: "absolute", inset: -2, border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, pointerEvents: "none" }} />
    <div style={{ position: "absolute", inset: -10, border: "1.5px dashed rgba(255,255,255,0.38)", borderRadius: 28, pointerEvents: "none" }} />
    {[[-7, -7], [w - 2, -7], [-7, h - 2], [w - 2, h - 2]].map(([l, t], i) => (
      <div key={i} style={{ position: "absolute", width: 10, height: 10, background: "rgba(255,255,255,0.75)", borderRadius: 2, left: l, top: t }} />
    ))}
  </>
);

const S1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CW = 700, CH = 440;
  const SW = 580, SH = 350;

  // Camera zoom on entry
  const cameraZoom = interpolate(frame, [0, 20], [1.04, 1.0], { extrapolateRight: "clamp" });

  // Phase 1: center card pops in (0-24f)
  const mainSpring = spring({ frame, fps, config: { damping: 8, mass: 0.8, stiffness: 180 } });
  const mainScale  = interpolate(mainSpring, [0, 1], [0.02, 1]);
  const bgFade     = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Phase 2: search bar + typewriter (24-88f)
  const barPr   = interpolate(frame, [24, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barX    = interpolate(1 - Math.pow(1 - barPr, 3), [0, 1], [-300, 0]);
  const barGlow = interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const searchText = "melhor confecção private label do brasil";
  const charsN = Math.floor(interpolate(frame, [42, 88], [0, searchText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const displayText = searchText.slice(0, charsN);
  const cursorBlink = frame < 100 && Math.floor(frame / 7) % 2 === 0;
  const preHL    = "melhor confecção ";
  const beforeHL = displayText.length <= preHL.length ? displayText : preHL;
  const insideHL = displayText.length >  preHL.length ? displayText.slice(preHL.length) : "";

  // Phase 3: satellites staggered (40-80f)
  const spTL = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.7 } });
  const spTR = spring({ frame: frame - 50, fps, config: { damping: 12, mass: 0.7 } });
  const spBL = spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.7 } });
  const spBR = spring({ frame: frame - 70, fps, config: { damping: 12, mass: 0.7 } });
  // Entry translations (no clamp = natural spring overshoot)
  const tlEx = interpolate(spTL, [0, 1], [-200, 0]);
  const tlEy = interpolate(spTL, [0, 1], [-200, 0]);
  const trEx = interpolate(spTR, [0, 1], [200, 0]);
  const trEy = interpolate(spTR, [0, 1], [-200, 0]);
  const blEx = interpolate(spBL, [0, 1], [-200, 0]);
  const blEy = interpolate(spBL, [0, 1], [200, 0]);
  const brEx = interpolate(spBR, [0, 1], [200, 0]);
  const brEy = interpolate(spBR, [0, 1], [200, 0]);
  const TL_ROT = -7, TR_ROT = 6, BL_ROT = 5, BR_ROT = -4;

  // Phase 4: orbital merge (85-125f) with sine-curved paths
  const mergePr    = interpolate(frame, [85, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mergeE     = mergePr * mergePr;
  const mergeScale = interpolate(mergeE, [0, 0.7, 1], [1, 0.5, 0]);
  const mergeOp    = interpolate(mergeE, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Orbital sine arc for magnetic pull feel
  const orbitAmt = Math.sin(mergePr * Math.PI) * 55;
  const mTLx = interpolate(mergeE, [0, 1], [0, 220]) + orbitAmt;
  const mTLy = interpolate(mergeE, [0, 1], [0, 445]) - orbitAmt * 0.5;
  const mTRx = interpolate(mergeE, [0, 1], [0, -220]) - orbitAmt;
  const mTRy = interpolate(mergeE, [0, 1], [0, 495]) - orbitAmt * 0.5;
  const mBLx = interpolate(mergeE, [0, 1], [0, 220]) + orbitAmt;
  const mBLy = interpolate(mergeE, [0, 1], [0, -445]) + orbitAmt * 0.5;
  const mBRx = interpolate(mergeE, [0, 1], [0, -220]) - orbitAmt;
  const mBRy = interpolate(mergeE, [0, 1], [0, -445]) + orbitAmt * 0.5;
  // Motion blur proportional to orbital velocity
  const mergeVel = Math.abs(Math.cos(mergePr * Math.PI)) * 55;
  const motionBlurPx = interpolate(mergeVel, [0, 55], [0, 6]);
  const endBlurPx = interpolate(mergeE, [0.7, 1], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trailOp = interpolate(mergeE, [0.1, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Mouse cursor movement (18-130f)
  const cursorX0 = interpolate(frame, [18, 38], [280, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorY0 = interpolate(frame, [18, 38], [20, 80],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX1 = interpolate(frame, [90, 120], [60, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorY1 = interpolate(frame, [90, 120], [80, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX  = frame >= 90 ? cursorX1 : cursorX0;
  const cursorY  = frame >= 90 ? cursorY1 : cursorY0;

  // Click animation at frame 120
  const clickSp    = spring({ frame: frame - 120, fps, config: { damping: 8, mass: 0.4, stiffness: 300 } });
  const clickScale = interpolate(clickSp, [0, 0.25, 1], [1, 0.65, 1]);
  const clickRingOp   = interpolate(frame, [120, 122, 134], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clickRingSize = interpolate(frame, [120, 135], [8, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flash (123-136f)
  const flash = interpolate(frame, [123, 128, 137], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bag reveal (133-165f)
  const bagRevPr    = spring({ frame: frame - 133, fps, config: { damping: 10, mass: 0.9, stiffness: 140 } });
  const bagRevScale = interpolate(bagRevPr, [0, 1], [0, 1]);
  const bagRevBlur  = interpolate(bagRevPr, [0, 0.6], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagRevRot   = interpolate(bagRevPr, [0, 0.8], [-180, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagRevOp    = interpolate(bagRevPr, [0, 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagGlow     = interpolate(bagRevPr, [0.5, 1], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagBreathe  = 1 + Math.sin(frame / 12) * 0.02;

  // LS Logo (155-178f): spring overshoot 0→120%→100%, then shrinks for iris
  const logoPr    = spring({ frame: frame - 155, fps, config: { damping: 10, mass: 0.7, stiffness: 180 } });
  const logoGrow  = interpolate(logoPr, [0, 1], [0, 1]);
  const logoShrPr = interpolate(frame, [170, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoSc    = logoGrow * (1 - logoShrPr * 0.97);
  const logoOp    = interpolate(logoPr, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                    * (1 - interpolate(frame, [177, 184], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Iris wipe (176-190f): lime circle expands from center → reveals S2 lime bg
  const irisPr = interpolate(frame, [176, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const irisE  = irisPr * irisPr;
  const irisPx = interpolate(irisE, [0, 1], [0, 1600]);

  const satWrap = (
    restL: number, restT: number,
    ex: number, ey: number,
    mx: number, my: number,
    rot: number, sp: number
  ): React.CSSProperties => ({
    position: "absolute" as const,
    left: restL, top: restT,
    width: SW, height: SH,
    transform: `translate(${ex + mx}px,${ey + my}px) rotate(${interpolate(mergeE, [0, 1], [rot, 0])}deg) scale(${mergeScale})`,
    transformOrigin: "center center",
    opacity: sp * mergeOp,
    filter: (motionBlurPx + endBlurPx) > 0 ? `blur(${(motionBlurPx + endBlurPx).toFixed(1)}px)` : "none",
  });

  return (
    <AbsoluteFill style={{ background: T.accent, opacity: bgFade, overflow: "hidden" }}>

      <div style={{ position: "absolute", inset: 0, transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}>
        <InlineGrid id="geo1" />

        <AbsoluteFill>
          {/* TOP-LEFT: Light Mac-style window */}
          {frame >= 40 && frame < 125 && (
            <div style={satWrap(30, 340, tlEx, tlEy, mTLx, mTLy, TL_ROT, spTL)}>
              <div style={{ width: "100%", height: "100%", background: "#F5F7FA", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 16px 56px rgba(0,0,0,0.22)" }}>
                <div style={{ height: 34, background: "#E8EAED", display: "flex", alignItems: "center", padding: "0 14px", gap: 7, borderBottom: "1px solid #D0D4DB", flexShrink: 0 }}>
                  {["#FF5F56", "#FFBD2E", "#27C93F"].map((c, i) => (<div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />))}
                  <div style={{ flex: 1, height: 8, background: "#C8CDD5", borderRadius: 4, maxWidth: 130, marginLeft: 10 }} />
                </div>
                <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[70, 105, 55, 80].map((w, i) => (<div key={i} style={{ width: w, height: 24, borderRadius: 12, background: i === 1 ? "#263A4A" : "#D0D5DE" }} />))}
                  </div>
                  <div style={{ background: "#1A2B3C", borderRadius: 14, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>🔍</span>
                    <span style={{ fontFamily: F.ui, fontSize: 15, color: "#9BB8CA" }}>confecção premium...</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, flex: 1 }}>
                    {[{ bg: "#ECEEF2" }, { bg: "#F0F3F7" }].map((b, i) => (
                      <div key={i} style={{ flex: 1, background: b.bg, borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ width: 38, height: 5, background: "#B0B5BE", borderRadius: 3, marginBottom: 8 }} />
                        <div style={{ width: 60, height: 5, background: "#C8CDD4", borderRadius: 3 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SatBorder w={SW} h={SH} />
            </div>
          )}

          {/* TOP-RIGHT: Gmail-style email inbox */}
          {frame >= 50 && frame < 125 && (
            <div style={satWrap(470, 290, trEx, trEy, mTRx, mTRy, TR_ROT, spTR)}>
              <div style={{ width: "100%", height: "100%", background: "#FFFFFF", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 16px 56px rgba(0,0,0,0.18)" }}>
                <div style={{ height: 36, background: "#F5F5F5", display: "flex", alignItems: "center", padding: "0 14px", gap: 10, borderBottom: "1px solid #E2E2E2", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "conic-gradient(#EA4335 0deg 90deg,#FBBC05 90deg 180deg,#34A853 180deg 270deg,#4285F4 270deg 360deg)", flexShrink: 0 }} />
                  <div style={{ flex: 1, background: "#E8E8E8", borderRadius: 14, height: 22, display: "flex", alignItems: "center", paddingLeft: 12 }}>
                    <span style={{ fontFamily: F.ui, fontSize: 11, color: "#888" }}>Pesquisar e-mail</span>
                  </div>
                  <span style={{ color: T.accent, fontFamily: F.ui, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Novo</span>
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  {[
                    { s: "Parabéns pela produção!", t: "agora", u: true },
                    { s: "Pedido confirmado",       t: "10h",   u: false },
                    { s: "Mochila ficou incrível!", t: "ontem", u: true },
                  ].map((e, i) => (
                    <div key={i} style={{ padding: "9px 16px", borderBottom: "1px solid #F2F2F2", display: "flex", alignItems: "center", gap: 10, background: e.u ? "#F7FFF0" : "transparent" }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: e.u ? T.accent : "transparent", border: `1.5px solid ${e.u ? T.accent : "#CCC"}`, flexShrink: 0 }} />
                      <span style={{ fontFamily: F.ui, fontSize: 12, color: "#111", fontWeight: e.u ? 700 : 400, flex: 1 }}>{e.s}</span>
                      <span style={{ fontFamily: F.ui, fontSize: 10, color: "#AAA", flexShrink: 0 }}>{e.t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <SatBorder w={SW} h={SH} />
            </div>
          )}

          {/* BOTTOM-LEFT: Dark email client */}
          {frame >= 60 && frame < 125 && (
            <div style={satWrap(30, 1230, blEx, blEy, mBLx, mBLy, BL_ROT, spBL)}>
              <div style={{ width: "100%", height: "100%", background: "#0D1B2A", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 16px 56px rgba(0,0,0,0.45)" }}>
                <div style={{ height: 36, background: "#091520", display: "flex", alignItems: "center", padding: "0 16px", gap: 10, borderBottom: `1px solid ${T.accent}22`, flexShrink: 0 }}>
                  <span style={{ color: "#667788", fontSize: 18 }}>☰</span>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#4285F4", flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 8, background: "#1E3044", borderRadius: 4, maxWidth: 110 }} />
                </div>
                <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontFamily: F.ui, fontSize: 10, color: "#667788", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>CAIXA DE ENT...</div>
                  {[
                    { label: "Venda concluída ✓",   dot: T.accent, bold: true },
                    { label: "Produção iniciada",    dot: "#445566", bold: false },
                    { label: "Pagamento confirmado", dot: T.accent, bold: true },
                  ].map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.accent}11` }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: e.dot, flexShrink: 0 }} />
                      <span style={{ fontFamily: F.ui, fontSize: 13, color: T.white, fontWeight: e.bold ? 700 : 400, flex: 1 }}>{e.label}</span>
                      <span style={{ color: T.muted, fontFamily: F.ui, fontSize: 12 }}>–</span>
                    </div>
                  ))}
                </div>
              </div>
              <SatBorder w={SW} h={SH} />
            </div>
          )}

          {/* BOTTOM-RIGHT: Spreadsheet */}
          {frame >= 70 && frame < 125 && (
            <div style={satWrap(470, 1230, brEx, brEy, mBRx, mBRy, BR_ROT, spBR)}>
              <div style={{ width: "100%", height: "100%", background: "white", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 16px 56px rgba(0,0,0,0.2)" }}>
                <div style={{ background: "#1B7F3C", padding: "12px 18px", flexShrink: 0 }}>
                  <div style={{ fontFamily: F.ui, fontSize: 12, color: "white", fontWeight: 700, letterSpacing: 0.4 }}>ORÇAMENTO LS CONFECÇÕES</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", background: "#2A6B3C", padding: "7px 16px" }}>
                  {["Produto", "Qtd", "Custo"].map(h => (<span key={h} style={{ fontFamily: F.ui, fontSize: 11, color: "white", fontWeight: 700 }}>{h}</span>))}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  {[["Eco Bag", "1.000 un", "R$ 10"], ["Mochila", "30 un", "R$ 70"], ["Tote Bag", "20 un", "R$ 25"], ["Pochete", "50 un", "R$ 35"]].map(([p, q, r], i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", padding: "9px 16px", background: i % 2 === 0 ? "#F4FFF7" : "white", borderBottom: "1px solid #DFF0E2" }}>
                      <span style={{ fontFamily: F.ui, fontSize: 11, color: "#222", fontWeight: 500 }}>{p}</span>
                      <span style={{ fontFamily: F.ui, fontSize: 11, color: "#555" }}>{q}</span>
                      <span style={{ fontFamily: F.ui, fontSize: 11, color: "#1B7F3C", fontWeight: 700 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <SatBorder w={SW} h={SH} />
            </div>
          )}

          {/* Particle trail during merge */}
          {mergePr > 0 && mergePr < 1 && Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const dist  = interpolate(mergeE, [0, 1], [500, 0]);
            const ptOp  = interpolate(mergeE, [0.1, 0.7, 1], [0, trailOp * 0.8, 0]);
            return (
              <div key={i} style={{ position: "absolute", left: 540, top: 960, width: i % 3 === 0 ? 10 : 6, height: i % 3 === 0 ? 10 : 6, borderRadius: i % 2 === 0 ? "50%" : 3, background: "#0D1B2A", opacity: ptOp, transform: `translate(-50%,-50%) translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)` }} />
            );
          })}

          {/* CENTER: Main card */}
          <div style={{
            position: "absolute",
            left: 190, top: 740,
            width: CW, height: CH,
            background: "#0D1B2A",
            borderRadius: 24,
            border: `2.5px solid ${bagRevOp > 0.5 ? T.accent + "ee" : T.accent + "88"}`,
            boxShadow: bagRevOp > 0.3
              ? `inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 ${bagGlow}px ${T.accent}88, 0 0 ${bagGlow * 2}px ${T.accent}44, 0 24px 80px rgba(0,0,0,0.7)`
              : `inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 40px ${T.accent}44, 0 24px 70px rgba(0,0,0,0.65)`,
            overflow: "hidden",
            transform: `scale(${mainScale * (bagRevOp > 0.3 ? bagBreathe : 1)})`,
            transformOrigin: "center center",
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
          }}>
            <div style={{ height: 44, background: "#091520", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, borderBottom: `1px solid ${T.accent}22`, flexShrink: 0 }}>
              <div style={{ width: 13, height: 13, borderRadius: "50%", background: T.accent }} />
              <div style={{ flex: 1, height: 9, background: "#1E3044", borderRadius: 5, maxWidth: 180 }} />
            </div>
            <div style={{ padding: "24px 30px", display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
              <div style={{ display: "flex", gap: 10, opacity: barPr }}>
                {[{ w: 105, a: true }, { w: 68 }, { w: 118 }, { w: 78 }, { w: 95 }].map((p, i) => (
                  <div key={i} style={{ width: p.w, height: 34, borderRadius: 17, background: p.a ? "#1B3A55" : "#162333", border: p.a ? `1.5px solid ${T.accent}77` : "1px solid #1E3044", flexShrink: 0 }} />
                ))}
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
                <div style={{
                  width: "100%", background: "white", borderRadius: 34, padding: "18px 26px",
                  display: "flex", alignItems: "center", gap: 14,
                  transform: `translateX(${barX}px)`,
                  boxShadow: barGlow > 0.5
                    ? `0 0 ${barGlow * 24}px ${T.accent}66, 0 6px 24px rgba(0,0,0,0.12)`
                    : "0 6px 24px rgba(0,0,0,0.08)",
                }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>🎒</span>
                  <span style={{ fontFamily: F.ui, fontSize: 21, flex: 1, fontWeight: 500 }}>
                    <span style={{ color: "#333" }}>{beforeHL}</span>
                    {insideHL && (
                      <mark style={{ background: `${T.accent}55`, color: "#0A0A0A", fontWeight: 800, borderRadius: 5, padding: "2px 5px" }}>
                        {insideHL}
                      </mark>
                    )}
                    {cursorBlink && <span style={{ borderLeft: "2px solid #444", marginLeft: 2 }}>&nbsp;</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Bag reveal overlay */}
            {frame >= 133 && (
              <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1B2A" }}>
                <div style={{ opacity: bagRevOp, transform: `scale(${bagRevScale}) rotate(${bagRevRot}deg)`, filter: `blur(${bagRevBlur}px) drop-shadow(0 0 ${bagGlow}px ${T.accent}cc)` }}>
                  <div style={{ position: "relative", width: 220, height: 220 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `${T.accent}18` }} />
                    <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: `${T.accent}28` }} />
                    <div style={{ position: "absolute", inset: 32, borderRadius: "50%", background: "#0A1520", border: `3px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <SlingBagSVG size={90} color={T.accent} />
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* LS Logo */}
            {frame >= 155 && (
              <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1B2A", zIndex: 2 }}>
                <div style={{
                  opacity: logoOp,
                  transform: `scale(${logoSc})`,
                  filter: `drop-shadow(0 0 ${bagGlow * logoSc}px ${T.accent}cc)`,
                  width: 140, height: 140, borderRadius: 32,
                  border: `3px solid ${T.accent}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: T.accent, fontFamily: F.brand, fontWeight: 700, fontSize: 62,
                  background: "#091520",
                }}>
                  LS
                </div>
              </AbsoluteFill>
            )}
          </div>
        </AbsoluteFill>
      </div>

      {/* Click ring */}
      {clickRingOp > 0 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", width: clickRingSize, height: clickRingSize, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.85)", opacity: clickRingOp, transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 60 }} />
      )}

      {/* Mouse cursor */}
      {frame >= 18 && frame < 132 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(${cursorX}px,${cursorY}px) scale(${frame >= 120 ? clickScale : 1})`, pointerEvents: "none", zIndex: 50, transformOrigin: "top left" }}>
          <svg width="30" height="37" viewBox="0 0 20 25" fill="none">
            <path d="M2 2L2 20L6.5 14.5L11 22L14 20.5L9.5 13L17 13Z" fill="white" stroke="rgba(0,0,0,0.45)" strokeWidth="1.3" />
          </svg>
        </div>
      )}

      {flash > 0 && <AbsoluteFill style={{ background: "white", opacity: flash * 0.6, pointerEvents: "none" }} />}

      {/* Grain */}
      <Grain />

      {/* Iris wipe: lime circle expands from center — S2 continues with same lime bg */}
      {frame >= 176 && (
        <AbsoluteFill style={{ background: T.accent, clipPath: `circle(${irisPx}px at 540px 960px)`, pointerEvents: "none", zIndex: 100 }} />
      )}
    </AbsoluteFill>
  );
};

// ─── S2 — Floating brand windows ─────────────────────────────────────────────

const S2_BRANDS = ["THUG NINE", "BOLOVO", "CARNAN", "FLAMENGO", "VASCO", "COROA", "SEABIRD", "DISTURB", "DUBS", "ALFA"];

const FloatingCard: React.FC<{
  brand: string; blur: number;
  x: number; y: number; rotation: number; driftX: number; driftY: number; delay: number;
}> = ({ brand, blur, x, y, rotation, driftX, driftY, delay }) => {
  const frame = useCurrentFrame();
  const t = (frame + delay * 30) / 30;
  const floatX = Math.sin(t * 0.6 + driftX) * 18;
  const floatY = Math.cos(t * 0.5 + driftY) * 22;
  const rot = rotation + Math.sin(t * 0.4 + driftX) * 3;
  const enterPr = interpolate(frame, [delay * 6, delay * 6 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translate(${floatX}px,${floatY}px) rotate(${rot}deg) scale(${enterPr})`,
      opacity: enterPr * (blur > 3 ? 0.65 : blur > 0 ? 0.82 : 1),
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      width: 190, height: 118, background: "#0D1B2A", borderRadius: 16,
      border: `1.5px solid ${T.accent}55`,
      boxShadow: `0 8px 32px rgba(0,0,0,0.28), inset 0 0 0 0.5px rgba(255,255,255,0.06)`,
      overflow: "hidden", zIndex: blur === 0 ? 2 : 1,
    }}>
      <div style={{ height: 24, background: "#091520", display: "flex", alignItems: "center", padding: "0 10px", gap: 6, borderBottom: `1px solid ${T.accent}22`, flexShrink: 0 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent }} />
        <div style={{ flex: 1, height: 4, background: "#1E3044", borderRadius: 2, maxWidth: 70 }} />
      </div>
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 17, fontWeight: 900, letterSpacing: 1.2 }}>{brand}</div>
        <div style={{ color: "#667788", fontFamily: F.ui, fontSize: 10 }}>private label · produção</div>
        <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
          {[50, 85, 35].map((w, i) => (<div key={i} style={{ width: w, height: 3, borderRadius: 2, background: i === 0 ? `${T.accent}44` : "#1E3044" }} />))}
        </div>
      </div>
    </div>
  );
};

const S2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const positions = [
    { x: 22, y: 18, rotation: -12, driftX: 0,   driftY: 0,   blur: 0, delay: 0   },
    { x: 72, y: 14, rotation: 8,   driftX: 1,   driftY: 0.5, blur: 3, delay: 1   },
    { x: 15, y: 42, rotation: -6,  driftX: 0.5, driftY: 1,   blur: 0, delay: 2   },
    { x: 80, y: 38, rotation: 14,  driftX: 1.5, driftY: 0.3, blur: 5, delay: 0.5 },
    { x: 35, y: 65, rotation: -10, driftX: 0.2, driftY: 1.2, blur: 0, delay: 1.5 },
    { x: 75, y: 62, rotation: 5,   driftX: 0.8, driftY: 0.7, blur: 4, delay: 2.5 },
    { x: 20, y: 82, rotation: -8,  driftX: 1.2, driftY: 0.2, blur: 0, delay: 0.3 },
    { x: 65, y: 85, rotation: 11,  driftX: 0.4, driftY: 1.5, blur: 6, delay: 1.8 },
    { x: 48, y: 30, rotation: -3,  driftX: 0.9, driftY: 0.6, blur: 2, delay: 3   },
    { x: 50, y: 75, rotation: 7,   driftX: 0.3, driftY: 0.9, blur: 0, delay: 0.8 },
  ];
  const textPr = spring({ frame: frame - 10, fps, config: { damping: 16, mass: 0.8 } });

  // Exit: zoom content to center + blur
  const exitPr    = interpolate(frame, [dur - 22, dur - 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(exitPr, [0, 1], [1, 0.3]);
  const exitBlur  = interpolate(exitPr, [0, 1], [0, 15]);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo2" />
      <AtmosphericBg color="#0D1B2A" intensity={0.08} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${exitScale})`, filter: exitBlur > 0 ? `blur(${exitBlur}px)` : "none", transformOrigin: "center center" }}>
        {S2_BRANDS.map((brand, i) => (<FloatingCard key={i} brand={brand} {...positions[i]} />))}
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ opacity: textPr, transform: `scale(${interpolate(textPr, [0, 1], [0.85, 1])})`, textAlign: "center", padding: "28px 40px", background: "#0D1B2A", borderRadius: 24, border: `1.5px solid ${T.accent}55`, boxShadow: `0 4px 60px rgba(0,0,0,0.22)` }}>
            <div style={{ color: T.white, fontFamily: F.ui, fontSize: 52, fontWeight: 900, lineHeight: 1.2 }}>
              E são tantas<br /><span style={{ color: T.accent }}>possibilidades</span>
            </div>
          </div>
        </AbsoluteFill>
      </div>
      <Grain />
      {/* S2 entry: iris handles it (no SceneTrans entry); exit: lime flash */}
      <SceneTrans dur={dur} entry={false} exit={true} />
    </AbsoluteFill>
  );
};

// ─── S3 — Bag models ─────────────────────────────────────────────────────────

const BAG_ROWS = [
  [<PocheteSVG size={90} color="#0A0A0A" />, <SlingBagSVG size={90} color="#0A0A0A" />, <MessengerSVG size={90} color="#0A0A0A" />, <ToteSVG size={90} color="#0A0A0A" />, <PocheteSVG size={90} color="#0A0A0A" />],
  [<ToteSVG size={80} color="#0A0A0A" />, <MessengerSVG size={80} color="#0A0A0A" />, <SlingBagSVG size={80} color="#0A0A0A" />, <PocheteSVG size={80} color="#0A0A0A" />, <ToteSVG size={80} color="#0A0A0A" />],
  [<SlingBagSVG size={100} color="#0A0A0A" />, <ToteSVG size={100} color="#0A0A0A" />, <PocheteSVG size={100} color="#0A0A0A" />, <MessengerSVG size={100} color="#0A0A0A" />, <SlingBagSVG size={100} color="#0A0A0A" />],
];

const S3: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = useCountUp(800, 10, 40);

  // Exit: counter card zooms large (punch-out)
  const exitPr    = interpolate(frame, [dur - 20, dur - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(exitPr, [0, 1], [1, 7]);
  const exitOp    = interpolate(exitPr, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo3" />
      <AtmosphericBg color="#0D1B2A" intensity={0.08} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", opacity: 0.12 }}>
        {BAG_ROWS.map((row, i) => (<BagScrollRow key={i} bags={row} dir={i % 2 === 0 ? 1 : -1} speed={0.5 + i * 0.15} />))}
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          opacity: exitOp,
          transform: `scale(${exitScale})`,
          transformOrigin: "center center",
          background: "#0D1B2A", border: `1.5px solid ${T.accent}55`, borderRadius: 28,
          padding: "40px 60px", textAlign: "center",
          boxShadow: `0 8px 60px rgba(0,0,0,0.22)`,
        }}>
          <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 90, fontWeight: 900 }}>+{count}</div>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 34, fontWeight: 700, marginTop: 4 }}>modelos já produzidos</div>
          <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>bolsas, mochilas, pochetes e acessórios</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 36 }}>
            {[PocheteSVG, SlingBagSVG, MessengerSVG, ToteSVG].map((BagComp, i) => {
              const pr = springIn(frame, fps, 20 + i * 5);
              return (
                <div key={i} style={{ opacity: pr, transform: `scale(${interpolate(pr, [0, 1], [0.5, 1])})`, width: 90, height: 90, background: `${T.accent}22`, border: `1px solid ${T.accent}66`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BagComp size={54} color="#0A0A0A" />
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <Grain />
      <SceneTrans dur={dur} />
    </AbsoluteFill>
  );
};

// ─── S4 — Marcas scrolling cards ─────────────────────────────────────────────

const S4_BRANDS = ["THUG NINE", "BOLOVO", "CARNAN", "FLAMENGO", "VASCO", "COROA"];

const BrandCardRow: React.FC<{ brands: string[]; dir: 1 | -1; speed?: number; y?: number; blurAmount?: number; exitTY?: number }> = ({
  brands, dir, speed = 0.8, y = 0, blurAmount = 0, exitTY = 0,
}) => {
  const frame = useCurrentFrame();
  const doubled = [...brands, ...brands, ...brands];
  const itemW = 420;
  const totalW = brands.length * itemW;
  const offset = (((frame * speed * dir) % totalW) + totalW) % totalW;
  return (
    <div style={{ overflow: "hidden", width: "100%", transform: `translateY(${y + exitTY}px)`, filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none" }}>
      <div style={{ display: "flex", transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {doubled.map((b, i) => (
          <div key={i} style={{ width: itemW, flexShrink: 0, padding: "12px 14px" }}>
            <div style={{
              background: "#0D1B2A", borderRadius: 28, padding: "36px 40px",
              display: "flex", flexDirection: "column", gap: 10,
              boxShadow: "0 8px 40px rgba(0,0,0,0.25)", height: 180,
              border: `1.5px solid ${T.accent}33`,
            }}>
              <div style={{ width: 44, height: 32, borderRadius: 7, background: `${T.accent}22`, border: `1px solid ${T.accent}44`, marginBottom: 4 }} />
              <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>{b}</div>
              <div style={{ color: "#334455", fontFamily: F.mono, fontSize: 14 }}>★★★★ ★★★★ ★★★★</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const S4: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textPr = spring({ frame: frame - 8, fps, config: { damping: 16, mass: 0.8 } });
  const rows = [S4_BRANDS, [...S4_BRANDS].reverse(), S4_BRANDS];

  // Exit: brand rows slide down
  const exitPr = interpolate(frame, [dur - 22, dur - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitTY = interpolate(exitPr, [0, 1], [0, 400]);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo4" />
      <AtmosphericBg color="#0D1B2A" intensity={0.10} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", paddingTop: 60, paddingBottom: 60 }}>
        {rows.map((row, i) => (
          <BrandCardRow key={i} brands={row} dir={i % 2 === 0 ? 1 : -1} speed={0.7 + i * 0.12} blurAmount={i === 0 ? 3 : i === 2 ? 4 : 0} exitTY={exitTY} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ opacity: textPr, transform: `scale(${interpolate(textPr, [0, 1], [0.88, 1])})`, textAlign: "center", padding: "30px 44px", background: "#0D1B2A", borderRadius: 26, border: `1.5px solid ${T.accent}55`, boxShadow: `0 4px 60px rgba(0,0,0,0.22)` }}>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 46, fontWeight: 900, lineHeight: 1.2 }}>
            E é tanta marca que<br /><span style={{ color: T.accent }}>confia na gente...</span>
          </div>
        </div>
      </AbsoluteFill>
      <Grain />
      <SceneTrans dur={dur} />
    </AbsoluteFill>
  );
};

// ─── S5 — Proposta de valor ───────────────────────────────────────────────────

const S5: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cards = [
    { t: "Simples", d: "Você cuida da marca, a gente da produção", icon: "✓" },
    { t: "Premium", d: "Materiais de qualidade e acabamento", icon: "★" },
    { t: "Sob medida", d: "Bordado, silk e cores da sua marca", icon: "✦" },
  ];

  // Exit: whole content scales to center
  const exitPr    = interpolate(frame, [dur - 20, dur - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(exitPr, [0, 1], [1, 0]);
  const exitBlur  = interpolate(exitPr, [0, 1], [0, 12]);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo5" />
      <AtmosphericBg color="#0D1B2A" intensity={0.08} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${exitScale})`, filter: exitBlur > 0 ? `blur(${exitBlur}px)` : "none", transformOrigin: "center center", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <div style={{ color: "#0A0A0A", fontFamily: F.ui, fontSize: 38, fontWeight: 800, textAlign: "center", padding: "0 40px" }}>
            Porque é <span style={{ color: "#0D1B2A", textDecoration: "underline" }}>simples</span>, premium e sob medida.
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", padding: "0 20px" }}>
            {cards.map((c, i) => {
              const pr = springIn(frame, fps, 12 + i * 10);
              return (
                <div key={i} style={{
                  opacity: pr, transform: `translateY(${interpolate(pr, [0, 1], [40, 0])}px)`,
                  background: "#0D1B2A", border: `2px solid ${i === 1 ? T.accent : T.accent + "44"}`,
                  borderRadius: 20, padding: "30px 22px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                  flex: 1, maxWidth: 280, textAlign: "center",
                }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: i === 1 ? T.accent : `${T.accent}22`, border: `2px solid ${T.accent}`, color: i === 1 ? "#0A0A0A" : T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>{c.icon}</div>
                  <div style={{ color: T.white, fontFamily: F.ui, fontSize: 26, fontWeight: 800 }}>{c.t}</div>
                  <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 16 }}>{c.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Grain />
      <SceneTrans dur={dur} />
    </AbsoluteFill>
  );
};

// ─── S6 — Prova social ────────────────────────────────────────────────────────

const S6: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const count = useCountUp(10, 10, 36);

  // Exit: counter card flips on X axis (scaleX goes to 0, then negative = "flip")
  const s6FlipPr = interpolate(frame, [dur - 18, dur - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flipScaleX = Math.cos(s6FlipPr * Math.PI / 2);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo6" />
      <AtmosphericBg color="#0D1B2A" intensity={0.08} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `scaleX(${flipScaleX})`,
          transformOrigin: "center center",
          background: "#0D1B2A", border: `1.5px solid ${T.accent}55`, borderRadius: 28,
          padding: "52px 80px", textAlign: "center",
          boxShadow: `0 8px 60px rgba(0,0,0,0.22)`,
        }}>
          <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 100, fontWeight: 900 }}>+{count} anos</div>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 30, fontWeight: 700, marginTop: 6 }}>de mercado e experiência</div>
          <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>As marcas já sabem disso. 🔥</div>
        </div>
      </AbsoluteFill>
      <Grain />
      <SceneTrans dur={dur} exit={true} entry={true} />
    </AbsoluteFill>
  );
};

// ─── S7 — CTA ────────────────────────────────────────────────────────────────

const S7: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(frame / 9) * 0.03;

  // Entry: scaleX flip-in (from 0 → 1) like card flipping
  const s7FlipPr = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flipScaleX = Math.sin(s7FlipPr * Math.PI / 2);

  // Dark iris exit: dark circle expands from center
  const darkIrisPr = interpolate(frame, [dur - 22, dur - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const darkIrisE  = darkIrisPr * darkIrisPr;
  const darkIrisPx = interpolate(darkIrisE, [0, 1], [0, 1600]);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo7" />
      <AtmosphericBg color="#0D1B2A" intensity={0.08} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `scaleX(${flipScaleX})`,
          transformOrigin: "center center",
          background: "#0D1B2A", border: `1.5px solid ${T.accent}55`, borderRadius: 28,
          padding: "52px 60px", textAlign: "center",
          boxShadow: `0 8px 60px rgba(0,0,0,0.22)`,
        }}>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 46, fontWeight: 900, lineHeight: 1.15 }}>
            Está esperando o quê<br />para produzir seus<br />acessórios?
          </div>
          <div style={{ marginTop: 40, transform: `scale(${pulse})`, background: T.accent, color: "#0A0A0A", fontFamily: F.ui, fontSize: 22, fontWeight: 800, padding: "18px 36px", borderRadius: 32, display: "inline-flex", alignItems: "center", gap: 12 }}>
            💬 Chamar no WhatsApp
          </div>
        </div>
      </AbsoluteFill>
      <Grain />
      {/* No SceneTrans exit — dark iris handles transition to S8 */}
      <SceneTrans dur={dur} entry={false} exit={false} />
      {/* Dark iris wipe to S8 */}
      {frame >= dur - 22 && (
        <AbsoluteFill style={{ background: T.bg, clipPath: `circle(${darkIrisPx}px at 540px 960px)`, pointerEvents: "none", zIndex: 100 }} />
      )}
    </AbsoluteFill>
  );
};

// ─── S8 — Logo cinematográfico ────────────────────────────────────────────────

const S8: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const convergeProgress = (i: number) => {
    const delay = i * 2;
    return spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6 } });
  };

  const logoPr = spring({ frame: frame - 10, fps, config: { damping: 13, mass: 0.9 } });
  const logoScale = interpolate(logoPr, [0, 1], [0.5, 1]);
  const logoBlur = interpolate(logoPr, [0, 0.7], [16, 0], { extrapolateRight: "clamp" });
  const logoOpacity = interpolate(logoPr, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = 1 + Math.sin(frame / 18) * 0.018;
  const logoGlow = interpolate(logoPr, [0.6, 1], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const textPr = spring({ frame: frame - 30, fps, config: { damping: 16, mass: 0.7 } });
  const textY = interpolate(textPr, [0, 1], [28, 0]);
  const textOp = interpolate(textPr, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardPr = spring({ frame: frame - 50, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <AtmosphericBg color={T.accent} intensity={0.22} />
      <InlineGrid id="geo8" dark />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          const pr = convergeProgress(i);
          const dist = interpolate(pr, [0, 1], [500, 0]);
          const opacity = interpolate(pr, [0, 0.1, 0.8, 1], [0, 1, 0.8, 0]);
          const size = i % 3 === 0 ? 8 : 5;
          return (
            <div key={i} style={{ position: "absolute", left: "50%", top: "35%", width: size, height: size, borderRadius: i % 2 === 0 ? "50%" : 2, background: T.accent, opacity, transform: `translate(-50%,-50%) translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)` }} />
          );
        })}
      </AbsoluteFill>
      <GlowFlash startFrame={8} color={`${T.accent}88`} duration={8} />
      <GlowFlash startFrame={10} color="#ffffff" duration={5} />
      <GlowRing startFrame={18} x="50%" y="35%" color={T.accent} />
      <BurstParticles startFrame={10} x="50%" y="35%" count={8} color={T.accent} />
      <LightSweep startFrame={22} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale * breathe})`, filter: `blur(${logoBlur}px) drop-shadow(0 0 ${logoGlow}px ${T.accent}cc)`, width: 110, height: 110, borderRadius: 26, border: `3px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, fontFamily: F.brand, fontWeight: 700, fontSize: 52 }}>
          LS
        </div>
        <div style={{ opacity: textOp, transform: `translateY(${textY}px)`, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 38, fontWeight: 800 }}>LS CONFECÇÕES</div>
          <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>SUA MARCA. NOSSA PRODUÇÃO.</div>
        </div>
        <LightSweep startFrame={42} />
        <div style={{ opacity: cardPr, transform: `translateY(${interpolate(cardPr, [0, 1], [20, 0])}px)`, marginTop: 16, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 30px", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ color: T.white, fontFamily: F.mono, fontSize: 20 }}>💬 (11) 99937-0418</span>
          <span style={{ color: T.muted, fontFamily: F.mono, fontSize: 17 }}>🌐 lsconfex.com.br</span>
          <span style={{ color: T.muted, fontFamily: F.mono, fontSize: 17 }}>📸 @lsconfex</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const D = { s1: 190, s2: 95, s3: 90, s4: 110, s5: 110, s6: 80, s7: 90, s8: 110 };
export const TOTAL = Object.values(D).reduce((a, b) => a + b, 0);

const Main: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
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
