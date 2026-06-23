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
    <text x="60" y="76" textAnchor="middle" fill={color} fontSize="12" fontFamily="Georgia">LS</text>
  </svg>
);

const HoboSVG: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = T.accent }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M20 30 Q10 60 12 75 Q14 92 50 92 Q86 92 88 75 Q90 60 80 30" stroke={color} strokeWidth="3" fill="none" />
    <path d="M20 30 Q35 10 50 14 Q65 10 80 30" stroke={color} strokeWidth="2.5" fill="none" />
    <path d="M30 30 Q20 20 18 8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M32 50 Q50 44 68 50 Q72 64 68 72 Q50 78 32 72 Z" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="18" cy="7" r="4" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

const NecessaireSVG: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = T.accent }) => (
  <svg width={size * 1.3} height={size * 0.8} viewBox="0 0 130 80" fill="none">
    <rect x="4" y="18" width="122" height="58" rx="10" stroke={color} strokeWidth="3" fill="none" />
    <path d="M35 18 Q35 4 65 4 Q95 4 95 18" stroke={color} strokeWidth="2.5" fill="none" />
    <line x1="4" y1="34" x2="126" y2="34" stroke={color} strokeWidth="1.5" strokeDasharray="5 3" />
    <circle cx="65" cy="26" r="6" stroke={color} strokeWidth="2" fill="none" />
    <rect x="20" y="44" width="30" height="20" rx="4" stroke={color} strokeWidth="1.5" fill="none" />
    <rect x="58" y="44" width="30" height="20" rx="4" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="102" cy="54" r="10" stroke={color} strokeWidth="1.5" fill="none" />
  </svg>
);

// ─── Cinematic Utilities ──────────────────────────────────────────────────────

const AtmosphericBg: React.FC<{ color?: string; intensity?: number }> = ({
  color = "#000000", intensity = 0.10,
}) => {
  const frame = useCurrentFrame();
  const x  = 50 + Math.sin(frame / 70) * 12;
  const y  = 50 + Math.cos(frame / 90) * 9;
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
  const opacity = interpolate(frame, [startFrame, startFrame + duration / 2, startFrame + duration], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
          const angle   = (i / count) * Math.PI * 2;
          const delay   = i * 1.5;
          const progress = interpolate(frame, [startFrame + delay, startFrame + delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const dist    = interpolate(progress, [0, 0.6, 1], [0, 110, 140]);
          const opacity = interpolate(progress, [0, 0.2, 0.7, 1], [0, 1, 0.6, 0]);
          const size    = i % 3 === 0 ? 7 : i % 3 === 1 ? 5 : 9;
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
  const pr    = spring({ frame: frame - startFrame, fps: 30, config: { damping: 18, mass: 0.7 } });
  const size  = interpolate(pr, [0, 1], [40, 380]);
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

// ─── Inline Grid ─────────────────────────────────────────────────────────────

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
  const frame  = useCurrentFrame();
  const inOp   = entry ? interpolate(frame, [0, tf], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const outOp  = exit  ? interpolate(frame, [dur - tf, dur - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <>
      {inOp  > 0.01 && <AbsoluteFill style={{ background: color, opacity: inOp,  pointerEvents: "none", zIndex: 200 }} />}
      {outOp > 0.01 && <AbsoluteFill style={{ background: color, opacity: outOp, pointerEvents: "none", zIndex: 200 }} />}
    </>
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

  const SW = 580, SH = 350;

  // Camera zoom entry
  const cameraZoom = interpolate(frame, [0, 20], [1.04, 1.0], { extrapolateRight: "clamp" });

  // Center card pop-in
  const mainSpring = spring({ frame, fps, config: { damping: 8, mass: 0.8, stiffness: 180 } });
  const mainScale  = interpolate(mainSpring, [0, 1], [0.02, 1]);
  const bgFade     = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Search bar + typewriter
  const barPr   = interpolate(frame, [24, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barX    = interpolate(1 - Math.pow(1 - barPr, 3), [0, 1], [-300, 0]);
  const barGlow = interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const searchText = "melhor confecção private label do brasil";
  const charsN     = Math.floor(interpolate(frame, [42, 88], [0, searchText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const displayText = searchText.slice(0, charsN);
  const cursorBlink = frame < 100 && Math.floor(frame / 7) % 2 === 0;
  const preHL    = "melhor confecção ";
  const beforeHL = displayText.length <= preHL.length ? displayText : preHL;
  const insideHL = displayText.length >  preHL.length ? displayText.slice(preHL.length) : "";

  // Satellites
  const spTL = spring({ frame: frame - 40, fps, config: { damping: 12, mass: 0.7 } });
  const spTR = spring({ frame: frame - 50, fps, config: { damping: 12, mass: 0.7 } });
  const spBL = spring({ frame: frame - 60, fps, config: { damping: 12, mass: 0.7 } });
  const spBR = spring({ frame: frame - 70, fps, config: { damping: 12, mass: 0.7 } });
  const tlEx = interpolate(spTL, [0, 1], [-200, 0]);
  const tlEy = interpolate(spTL, [0, 1], [-200, 0]);
  const trEx = interpolate(spTR, [0, 1], [200, 0]);
  const trEy = interpolate(spTR, [0, 1], [-200, 0]);
  const blEx = interpolate(spBL, [0, 1], [-200, 0]);
  const blEy = interpolate(spBL, [0, 1], [200, 0]);
  const brEx = interpolate(spBR, [0, 1], [200, 0]);
  const brEy = interpolate(spBR, [0, 1], [200, 0]);
  const TL_ROT = -7, TR_ROT = 6, BL_ROT = 5, BR_ROT = -4;

  // Orbital merge (85-125f)
  const mergePr  = interpolate(frame, [85, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mergeE   = mergePr * mergePr;
  const mergeScale = interpolate(mergeE, [0, 0.7, 1], [1, 0.5, 0]);
  const mergeOp  = interpolate(mergeE, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbitAmt = Math.sin(mergePr * Math.PI) * 55;
  const mTLx = interpolate(mergeE, [0, 1], [0, 220]) + orbitAmt;
  const mTLy = interpolate(mergeE, [0, 1], [0, 445]) - orbitAmt * 0.5;
  const mTRx = interpolate(mergeE, [0, 1], [0, -220]) - orbitAmt;
  const mTRy = interpolate(mergeE, [0, 1], [0, 495]) - orbitAmt * 0.5;
  const mBLx = interpolate(mergeE, [0, 1], [0, 220]) + orbitAmt;
  const mBLy = interpolate(mergeE, [0, 1], [0, -445]) + orbitAmt * 0.5;
  const mBRx = interpolate(mergeE, [0, 1], [0, -220]) - orbitAmt;
  const mBRy = interpolate(mergeE, [0, 1], [0, -445]) + orbitAmt * 0.5;
  const mergeVel    = mergePr > 0 ? Math.abs(Math.cos(mergePr * Math.PI)) * 55 : 0;
  const motionBlurPx = mergePr > 0 ? interpolate(mergeVel, [0, 55], [0, 5]) : 0;
  const endBlurPx   = interpolate(mergeE, [0.7, 1], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trailOp     = interpolate(mergeE, [0.1, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Click
  const cursorX0 = interpolate(frame, [18, 38], [280, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorY0 = interpolate(frame, [18, 38], [20, 80],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX1 = interpolate(frame, [90, 120], [60, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorY1 = interpolate(frame, [90, 120], [80, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX  = frame >= 90 ? cursorX1 : cursorX0;
  const cursorY  = frame >= 90 ? cursorY1 : cursorY0;
  const clickSp    = spring({ frame: frame - 120, fps, config: { damping: 8, mass: 0.4, stiffness: 300 } });
  const clickScale = interpolate(clickSp, [0, 0.25, 1], [1, 0.65, 1]);
  const clickRingOp   = interpolate(frame, [120, 122, 134], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clickRingSize = interpolate(frame, [120, 135], [8, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [123, 128, 137], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Card exits completely first (128-144f)
  const cardExitSc  = interpolate(frame, [128, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const centerCardSc = frame < 128 ? mainScale : mainScale * cardExitSc;

  // Bag appears ONLY after card is gone (starts at 145f), bounce spring (low damping = overshoot)
  const bagSpring = spring({ frame: frame - 145, fps, config: { damping: 7, mass: 0.6, stiffness: 220 } });
  const bagGrow   = interpolate(bagSpring, [0, 1], [0, 1]);
  const bagGlow   = interpolate(bagSpring, [0.5, 1], [0, 36], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagRevOp  = interpolate(bagSpring, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Bag shrinks away (163-172f) so logo can appear
  const bagExitPr = interpolate(frame, [163, 172], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bagFinalSc = bagGrow * (1 - bagExitPr);
  const bagFinalOp = bagRevOp * (1 - bagExitPr);

  // LS Logo appears as bag shrinks (starts 165f), bounce spring
  const logoPr    = spring({ frame: frame - 165, fps, config: { damping: 7, mass: 0.6, stiffness: 220 } });
  const logoGrow  = interpolate(logoPr, [0, 1], [0, 1]);
  const logoRevOp = interpolate(logoPr, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Logo shrinks for iris (178-185f)
  const logoExitPr = interpolate(frame, [178, 186], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoFinalSc = logoGrow * (1 - logoExitPr);
  const logoFinalOp = logoRevOp * (1 - logoExitPr);

  // Iris (183-190f)
  const irisPr = interpolate(frame, [183, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const irisPx = interpolate(irisPr * irisPr, [0, 1], [0, 1600]);

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
    filter: mergePr > 0 && (motionBlurPx + endBlurPx) > 0.3 ? `blur(${(motionBlurPx + endBlurPx).toFixed(1)}px)` : "none",
  });

  return (
    <AbsoluteFill style={{ background: T.accent, opacity: bgFade, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}>
        <InlineGrid id="geo1" />
        <AbsoluteFill>

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
                  {[{ s: "Parabéns pela produção!", t: "agora", u: true }, { s: "Pedido confirmado", t: "10h", u: false }, { s: "Mochila ficou incrível!", t: "ontem", u: true }].map((e, i) => (
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
                  {[{ label: "Venda concluída ✓", dot: T.accent, bold: true }, { label: "Produção iniciada", dot: "#445566", bold: false }, { label: "Pagamento confirmado", dot: T.accent, bold: true }].map((e, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.accent}11` }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: e.dot, flexShrink: 0 }} />
                      <span style={{ fontFamily: F.ui, fontSize: 13, color: T.white, fontWeight: e.bold ? 700 : 400, flex: 1 }}>{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <SatBorder w={SW} h={SH} />
            </div>
          )}

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

          {/* Particle trail */}
          {mergePr > 0 && mergePr < 1 && Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const dist  = interpolate(mergeE, [0, 1], [500, 0]);
            const ptOp  = interpolate(mergeE, [0.1, 0.7, 1], [0, trailOp * 0.8, 0]);
            return (
              <div key={i} style={{ position: "absolute", left: 540, top: 960, width: i % 3 === 0 ? 10 : 6, height: i % 3 === 0 ? 10 : 6, borderRadius: i % 2 === 0 ? "50%" : 3, background: "#0D1B2A", opacity: ptOp, transform: `translate(-50%,-50%) translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)` }} />
            );
          })}

          {/* Center card — vanishes completely before bag appears */}
          {frame < 147 && (
            <div style={{
              position: "absolute", left: 190, top: 740, width: 700, height: 440,
              background: "#0D1B2A", borderRadius: 24,
              border: `2.5px solid ${T.accent}88`,
              boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 40px ${T.accent}44, 0 24px 70px rgba(0,0,0,0.65)`,
              overflow: "hidden",
              transform: `scale(${centerCardSc})`,
              transformOrigin: "center center",
              display: "flex", flexDirection: "column", zIndex: 10,
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
                  <div style={{ width: "100%", background: "white", borderRadius: 34, padding: "18px 26px", display: "flex", alignItems: "center", gap: 14, transform: `translateX(${barX}px)`, boxShadow: barGlow > 0.5 ? `0 0 ${barGlow * 24}px ${T.accent}66, 0 6px 24px rgba(0,0,0,0.12)` : "0 6px 24px rgba(0,0,0,0.08)" }}>
                    <span style={{ fontSize: 26, flexShrink: 0 }}>🎒</span>
                    <span style={{ fontFamily: F.ui, fontSize: 21, flex: 1, fontWeight: 500 }}>
                      <span style={{ color: "#333" }}>{beforeHL}</span>
                      {insideHL && (<mark style={{ background: `${T.accent}55`, color: "#0A0A0A", fontWeight: 800, borderRadius: 5, padding: "2px 5px" }}>{insideHL}</mark>)}
                      {cursorBlink && <span style={{ borderLeft: "2px solid #444", marginLeft: 2 }}>&nbsp;</span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bag — appears only after card is gone, bounce spring */}
          {frame >= 145 && bagFinalOp > 0.01 && (
            <div style={{ position: "absolute", left: 540, top: 960, transform: `translate(-50%,-50%) scale(${bagFinalSc})`, opacity: bagFinalOp, filter: `drop-shadow(0 0 ${bagGlow}px ${T.accent}cc)`, zIndex: 15 }}>
              <div style={{ position: "relative", width: 260, height: 260 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#0D1B2A" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `${T.accent}18` }} />
                <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: `${T.accent}28` }} />
                <div style={{ position: "absolute", inset: 32, borderRadius: "50%", background: "#0A1520", border: `3px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SlingBagSVG size={100} color={T.accent} />
                </div>
              </div>
            </div>
          )}

          {/* LS Logo — appears only after bag is gone, bounce spring */}
          {frame >= 163 && logoFinalOp > 0.01 && (
            <div style={{
              position: "absolute", left: 540, top: 960,
              transform: `translate(-50%,-50%) scale(${logoFinalSc})`,
              opacity: logoFinalOp,
              filter: `drop-shadow(0 0 ${bagGlow * logoFinalSc}px ${T.accent}cc)`,
              zIndex: 16,
              width: 160, height: 160, borderRadius: 36,
              border: `3px solid ${T.accent}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: T.accent, fontFamily: F.brand, fontWeight: 700, fontSize: 68,
              background: "#091520",
            }}>
              LS
            </div>
          )}
        </AbsoluteFill>
      </div>

      {/* Click ring */}
      {clickRingOp > 0 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", width: clickRingSize, height: clickRingSize, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.85)", opacity: clickRingOp, transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 60 }} />
      )}

      {/* Cursor */}
      {frame >= 18 && frame < 132 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(${cursorX}px,${cursorY}px) scale(${frame >= 120 ? clickScale : 1})`, pointerEvents: "none", zIndex: 50, transformOrigin: "top left" }}>
          <svg width="30" height="37" viewBox="0 0 20 25" fill="none">
            <path d="M2 2L2 20L6.5 14.5L11 22L14 20.5L9.5 13L17 13Z" fill="white" stroke="rgba(0,0,0,0.45)" strokeWidth="1.3" />
          </svg>
        </div>
      )}

      {flash > 0 && <AbsoluteFill style={{ background: "white", opacity: flash * 0.6, pointerEvents: "none" }} />}
      <Grain />

      {/* Iris: lime → white */}
      {frame >= 183 && (
        <AbsoluteFill style={{ background: "white", clipPath: `circle(${irisPx}px at 540px 960px)`, pointerEvents: "none", zIndex: 100 }} />
      )}
      {frame >= 183 && irisPx < 1590 && (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 101 }}>
          <div style={{ position: "absolute", left: 540, top: 960, width: irisPx * 2, height: irisPx * 2, borderRadius: "50%", border: `3px solid ${T.accent}`, transform: "translate(-50%,-50%)", opacity: interpolate(irisPx, [0, 200, 1400], [0, 1, 0]) }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─── S2 — Colorful product cards scrolling + text overlay ────────────────────

// Large colorful cards like INZMO reference
const S2_CARD_ITEMS = [
  { label: "MOCHILA",    bg: "#C6FF3A", tc: "#000", Svg: SlingBagSVG },
  { label: "TOTE BAG",   bg: "#FF4136", tc: "#fff", Svg: ToteSVG },
  { label: "BOLSA",      bg: "#7B2FBE", tc: "#fff", Svg: HoboSVG },
  { label: "POCHETE",    bg: "#FF9F1C", tc: "#000", Svg: PocheteSVG },
  { label: "ECO BAG",    bg: "#00B4D8", tc: "#fff", Svg: ToteSVG },
  { label: "NECESSAIRE", bg: "#06D6A0", tc: "#000", Svg: NecessaireSVG },
  { label: "MESSENGER",  bg: "#EF476F", tc: "#fff", Svg: MessengerSVG },
  { label: "SLING BAG",  bg: "#118AB2", tc: "#fff", Svg: SlingBagSVG },
];

const BigProductCard: React.FC<{ label: string; bg: string; tc: string; Svg: React.FC<{ size?: number; color?: string }> }> = ({ label, bg, tc, Svg }) => (
  <div style={{ width: 300, height: 380, flexShrink: 0, background: bg, borderRadius: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "28px 20px 22px", overflow: "hidden", position: "relative" }}>
    {/* Large bag icon */}
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Svg size={160} color={tc === "#fff" ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)"} />
    </div>
    {/* Label */}
    <div style={{ fontFamily: F.ui, fontSize: 26, fontWeight: 900, color: tc, letterSpacing: 1.5, textAlign: "center", marginTop: 8 }}>{label}</div>
    {/* LS badge */}
    <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.18)", borderRadius: 10, padding: "4px 10px", fontFamily: F.brand, fontSize: 12, fontWeight: 700, color: tc, letterSpacing: 1 }}>LS</div>
  </div>
);

const BigCardRow: React.FC<{ dir?: 1 | -1; speed?: number }> = ({ dir = 1, speed = 0.7 }) => {
  const frame = useCurrentFrame();
  const doubled = [...S2_CARD_ITEMS, ...S2_CARD_ITEMS, ...S2_CARD_ITEMS];
  const itemW   = 320;
  const totalW  = S2_CARD_ITEMS.length * itemW;
  const offset  = (((frame * speed * dir) % totalW) + totalW) % totalW;
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div style={{ display: "flex", gap: 20, transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {doubled.map((item, i) => (<BigProductCard key={i} {...item} />))}
      </div>
    </div>
  );
};

const S2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textPr = spring({ frame: frame - 10, fps, config: { damping: 16, mass: 0.8 } });
  const exitPr    = interpolate(frame, [dur - 22, dur - 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(exitPr, [0, 1], [1, 0.3]);
  const exitBlur  = interpolate(exitPr, [0, 1], [0, 15]);

  return (
    <AbsoluteFill style={{ background: "white", overflow: "hidden" }}>
      {/* Scrolling big cards fill the background */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${exitScale})`, filter: exitBlur > 0 ? `blur(${exitBlur}px)` : "none", transformOrigin: "center center" }}>
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, padding: "80px 0" }}>
          <BigCardRow dir={1} speed={0.8} />
          <BigCardRow dir={-1} speed={0.6} />
        </AbsoluteFill>

        {/* Gradient vignette to make text legible */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 60%, transparent 100%)", pointerEvents: "none" }} />

        {/* Text overlay */}
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ opacity: textPr, transform: `scale(${interpolate(textPr, [0, 1], [0.85, 1])})`, textAlign: "center", padding: "28px 44px", background: "rgba(13,27,42,0.88)", borderRadius: 24, backdropFilter: "blur(6px)", boxShadow: "0 8px 60px rgba(0,0,0,0.22)" }}>
            <div style={{ color: "white", fontFamily: F.ui, fontSize: 52, fontWeight: 900, lineHeight: 1.2 }}>
              E são tantas<br /><span style={{ color: T.accent }}>possibilidades</span>
            </div>
          </div>
        </AbsoluteFill>
      </div>

      <SceneTrans dur={dur} entry={false} exit={true} color="white" />
    </AbsoluteFill>
  );
};

// ─── S3 — Product catalog: 5 rows, no overlay card, slight blur ───────────────

const PRODUCTS = [
  { name: "Eco Bag",     sub: "100% algodão",   Svg: ToteSVG,       bg: "#F0F7EE", accent: "#2D6A1F" },
  { name: "Mochila",     sub: "Impermeável",     Svg: SlingBagSVG,   bg: "#EEF0F7", accent: "#1F3D6A" },
  { name: "Bolsa Hobo",  sub: "Casual & estilo", Svg: HoboSVG,       bg: "#F7EEEE", accent: "#6A1F1F" },
  { name: "Pochete",     sub: "Crossbody",       Svg: PocheteSVG,    bg: "#F2EEF7", accent: "#4A1F6A" },
  { name: "Necessaire",  sub: "Viagem & beauty", Svg: NecessaireSVG, bg: "#F7F2EE", accent: "#6A3D1F" },
  { name: "Tote Bag",    sub: "Minimalista",     Svg: ToteSVG,       bg: "#EEF7F5", accent: "#1F6A5A" },
  { name: "Messenger",   sub: "Urban & prático", Svg: MessengerSVG,  bg: "#F7F0EE", accent: "#6A4A1F" },
  { name: "Sling Bag",   sub: "Esportivo",       Svg: SlingBagSVG,   bg: "#EEF5F7", accent: "#1F556A" },
  { name: "Bolsa Hobo",  sub: "Pufada premium",  Svg: HoboSVG,       bg: "#F5EEF7", accent: "#5A1F6A" },
  { name: "Eco Tote",    sub: "Sustentável",     Svg: ToteSVG,       bg: "#F7F5EE", accent: "#6A601F" },
];

const ProductCard: React.FC<{ name: string; sub: string; Svg: React.FC<{ size?: number; color?: string }>; bg: string; accent: string; delay: number }> = ({
  name, sub, Svg, bg, accent, delay,
}) => {
  const frame = useCurrentFrame();
  const pr = springIn(frame, 30, delay);
  return (
    <div style={{ width: 220, flexShrink: 0, background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", overflow: "hidden", opacity: pr, transform: `translateY(${interpolate(pr, [0, 1], [30, 0])}px)` }}>
      <div style={{ height: 160, background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ opacity: 0.9 }}><Svg size={90} color={accent} /></div>
        <div style={{ position: "absolute", top: 12, left: 12, background: "white", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontFamily: F.ui, fontWeight: 700, color: accent, letterSpacing: 0.5 }}>PRIVATE LABEL</div>
        <div style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: 8, background: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, fontFamily: F.brand, fontSize: 11, fontWeight: 700 }}>LS</div>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: F.ui, fontSize: 16, fontWeight: 900, color: "#0D1B2A", letterSpacing: 0.3 }}>{name}</div>
        <div style={{ fontFamily: F.ui, fontSize: 12, color: "#778899" }}>{sub}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <div style={{ fontFamily: F.ui, fontSize: 11, color: accent, fontWeight: 700 }}>Personalizar →</div>
          <div style={{ display: "flex", gap: 3 }}>
            {[accent, `${accent}88`, `${accent}44`].map((c, i) => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductRow: React.FC<{ items: typeof PRODUCTS; dir: 1 | -1; speed?: number; delay?: number }> = ({
  items, dir, speed = 0.6, delay = 0,
}) => {
  const frame = useCurrentFrame();
  const doubled = [...items, ...items, ...items];
  const itemW  = 240;
  const totalW = items.length * itemW;
  const offset = (((frame * speed * dir) % totalW) + totalW) % totalW;
  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "8px 0", filter: "blur(1.5px)" }}>
      <div style={{ display: "flex", transform: `translateX(-${offset}px)`, willChange: "transform", gap: 20 }}>
        {doubled.map((p, i) => (<ProductCard key={i} {...p} delay={delay + (i % items.length) * 3} />))}
      </div>
    </div>
  );
};

const S3: React.FC<{ dur: number }> = ({ dur }) => {
  const frame   = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count   = useCountUp(800, 10, 40);

  const exitPr    = interpolate(frame, [dur - 20, dur - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(exitPr, [0, 1], [1, 7]);
  const exitOp    = interpolate(exitPr, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const headerPr = spring({ frame: frame - 5, fps, config: { damping: 16, mass: 0.8 } });

  // Split 10 products into 5 groups of 2 for 5 rows
  const ROW_SETS = [
    PRODUCTS.slice(0, 5),
    PRODUCTS.slice(5),
    PRODUCTS.slice(2, 7),
    PRODUCTS.slice(0, 4).concat(PRODUCTS.slice(6, 8)),
    PRODUCTS.slice(3, 8).concat(PRODUCTS.slice(0, 1)),
  ];
  const DIRS: Array<1 | -1> = [1, -1, 1, -1, 1];
  const SPEEDS = [0.50, 0.65, 0.45, 0.70, 0.55];

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo3" />
      <AtmosphericBg color="#0D1B2A" intensity={0.06} />

      {/* 5 scrolling rows — blurred slightly */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 0, paddingTop: 180, paddingBottom: 40 }}>
        {ROW_SETS.map((items, i) => (
          <ProductRow key={i} items={items} dir={DIRS[i]} speed={SPEEDS[i]} delay={5 + i * 4} />
        ))}
      </AbsoluteFill>

      {/* Title — no background card, just text */}
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", opacity: headerPr, transform: `translateY(${interpolate(headerPr, [0, 1], [-20, 0])}px)`, zIndex: 10 }}>
        <div style={{ color: "#0A0A0A", fontFamily: F.ui, fontSize: 32, fontWeight: 900, letterSpacing: 0.5 }}>
          +{count} modelos produzidos
        </div>
        <div style={{ color: "rgba(0,0,0,0.6)", fontFamily: F.ui, fontSize: 16, marginTop: 6 }}>
          mochilas · bolsas · eco bags · necessaires e mais
        </div>
      </div>

      {/* Exit zoom — just the counter number */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ opacity: exitOp, transform: `scale(${exitScale})`, transformOrigin: "center center", textAlign: "center" }}>
          <div style={{ color: "#0A0A0A", fontFamily: F.ui, fontSize: 110, fontWeight: 900, lineHeight: 1, textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>+{count}</div>
          <div style={{ color: "#0A0A0A", fontFamily: F.ui, fontSize: 28, fontWeight: 700, opacity: 0.7 }}>modelos</div>
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
  const itemW  = 420;
  const totalW = brands.length * itemW;
  const offset = (((frame * speed * dir) % totalW) + totalW) % totalW;
  return (
    <div style={{ overflow: "hidden", width: "100%", transform: `translateY(${y + exitTY}px)`, filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none" }}>
      <div style={{ display: "flex", transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {doubled.map((b, i) => (
          <div key={i} style={{ width: itemW, flexShrink: 0, padding: "12px 14px" }}>
            <div style={{ background: "#0D1B2A", borderRadius: 28, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 8px 40px rgba(0,0,0,0.25)", height: 180, border: `1.5px solid ${T.accent}33` }}>
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
  const rows   = [S4_BRANDS, [...S4_BRANDS].reverse(), S4_BRANDS];
  const exitPr = interpolate(frame, [dur - 22, dur - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitTY = interpolate(exitPr, [0, 1], [0, 400]);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo4" />
      <AtmosphericBg color="#0D1B2A" intensity={0.10} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", paddingTop: 60, paddingBottom: 60 }}>
        {rows.map((row, i) => (<BrandCardRow key={i} brands={row} dir={i % 2 === 0 ? 1 : -1} speed={0.7 + i * 0.12} blurAmount={i === 0 ? 3 : i === 2 ? 4 : 0} exitTY={exitTY} />))}
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
  const cards  = [
    { t: "Simples",     d: "Você cuida da marca, a gente da produção", icon: "✓" },
    { t: "Premium",     d: "Materiais de qualidade e acabamento", icon: "★" },
    { t: "Sob medida",  d: "Bordado, silk e cores da sua marca", icon: "✦" },
  ];
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
            Porque é <span style={{ textDecoration: "underline" }}>simples</span>, premium e sob medida.
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", padding: "0 20px" }}>
            {cards.map((c, i) => {
              const pr = springIn(frame, fps, 12 + i * 10);
              return (
                <div key={i} style={{ opacity: pr, transform: `translateY(${interpolate(pr, [0, 1], [40, 0])}px)`, background: "#0D1B2A", border: `2px solid ${i === 1 ? T.accent : T.accent + "44"}`, borderRadius: 20, padding: "30px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flex: 1, maxWidth: 280, textAlign: "center" }}>
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
  const flipScaleX = Math.cos(interpolate(frame, [dur - 18, dur - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * Math.PI / 2);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo6" />
      <AtmosphericBg color="#0D1B2A" intensity={0.08} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scaleX(${flipScaleX})`, transformOrigin: "center center", background: "#0D1B2A", border: `1.5px solid ${T.accent}55`, borderRadius: 28, padding: "52px 80px", textAlign: "center", boxShadow: `0 8px 60px rgba(0,0,0,0.22)` }}>
          <div style={{ color: T.accent, fontFamily: F.ui, fontSize: 100, fontWeight: 900 }}>+{count} anos</div>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 30, fontWeight: 700, marginTop: 6 }}>de mercado e experiência</div>
          <div style={{ color: T.muted, fontFamily: F.ui, fontSize: 22, marginTop: 8 }}>As marcas já sabem disso. 🔥</div>
        </div>
      </AbsoluteFill>
      <Grain />
      <SceneTrans dur={dur} />
    </AbsoluteFill>
  );
};

// ─── S7 — CTA ────────────────────────────────────────────────────────────────

const S7: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pulse        = 1 + Math.sin(frame / 9) * 0.03;
  const flipScaleX   = Math.sin(interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * Math.PI / 2);
  const darkIrisPr   = interpolate(frame, [dur - 22, dur - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const darkIrisPx   = interpolate(darkIrisPr * darkIrisPr, [0, 1], [0, 1600]);

  return (
    <AbsoluteFill style={{ background: T.accent, overflow: "hidden" }}>
      <InlineGrid id="geo7" />
      <AtmosphericBg color="#0D1B2A" intensity={0.08} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scaleX(${flipScaleX})`, transformOrigin: "center center", background: "#0D1B2A", border: `1.5px solid ${T.accent}55`, borderRadius: 28, padding: "52px 60px", textAlign: "center", boxShadow: `0 8px 60px rgba(0,0,0,0.22)` }}>
          <div style={{ color: T.white, fontFamily: F.ui, fontSize: 46, fontWeight: 900, lineHeight: 1.15 }}>
            Está esperando o quê<br />para produzir seus<br />acessórios?
          </div>
          <div style={{ marginTop: 40, transform: `scale(${pulse})`, background: T.accent, color: "#0A0A0A", fontFamily: F.ui, fontSize: 22, fontWeight: 800, padding: "18px 36px", borderRadius: 32, display: "inline-flex", alignItems: "center", gap: 12 }}>
            💬 Chamar no WhatsApp
          </div>
        </div>
      </AbsoluteFill>
      <Grain />
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

  const logoPr     = spring({ frame: frame - 10, fps, config: { damping: 13, mass: 0.9 } });
  const logoScale  = interpolate(logoPr, [0, 1], [0.5, 1]);
  const logoBlur   = interpolate(logoPr, [0, 0.7], [16, 0], { extrapolateRight: "clamp" });
  const logoOp     = interpolate(logoPr, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe    = 1 + Math.sin(frame / 18) * 0.018;
  const logoGlow   = interpolate(logoPr, [0.6, 1], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textPr     = spring({ frame: frame - 30, fps, config: { damping: 16, mass: 0.7 } });
  const textY      = interpolate(textPr, [0, 1], [28, 0]);
  const textOp     = interpolate(textPr, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardPr     = spring({ frame: frame - 50, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <AtmosphericBg color={T.accent} intensity={0.22} />
      <InlineGrid id="geo8" dark />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          const pr    = spring({ frame: frame - i * 2, fps, config: { damping: 14, mass: 0.6 } });
          const dist  = interpolate(pr, [0, 1], [500, 0]);
          const opacity = interpolate(pr, [0, 0.1, 0.8, 1], [0, 1, 0.8, 0]);
          const size  = i % 3 === 0 ? 8 : 5;
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
        <div style={{ opacity: logoOp, transform: `scale(${logoScale * breathe})`, filter: `blur(${logoBlur}px) drop-shadow(0 0 ${logoGlow}px ${T.accent}cc)`, width: 110, height: 110, borderRadius: 26, border: `3px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, fontFamily: F.brand, fontWeight: 700, fontSize: 52 }}>LS</div>
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
