import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AppWindow } from "../components/AppWindow";
import { SceneWrapper } from "../components/Shared";
import { THEME, FONTS } from "../theme";

const LINES = [
  "$ ls-confeccoes --start",
  "",
  "  ╦  ╔═╗   ╔═╗╔═╗╔╗╔╔═╗╔═╗╔═╗╔═╗╔═╗╔═╗",
  "  ║  ╚═╗   ║  ║ ║║║║╠╣ ║╣ ║  ║  ║ ║║╣ ╚═╗",
  "  ╩═╝╚═╝   ╚═╝╚═╝╝╚╝╚  ╚═╝╚═╝╚═╝╚═╝╚═╝╚═╝",
  "",
  "  > Fábrica B2B de bolsas e acessórios .......... ON",
  "  > Private label desde 2014 ..................... OK",
  "  > +500 marcas atendidas ........................ OK",
  "  > +800 modelos disponíveis ..................... OK",
  "  > Mínimo de 20 unidades ........................ OK",
  "  > Personalização total ......................... OK",
  "",
  "  Carregando catálogo da sua marca...",
];

export const Scene1Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slide = spring({ frame, fps, config: { damping: 20, mass: 0.9 } });
  const translateY = interpolate(slide, [0, 1], [400, 0]);
  const rotY = Math.sin(frame / 30) * 2;

  const firstLine = LINES[0];
  const typedChars = Math.min(firstLine.length, Math.max(0, frame - 10));
  const typed = firstLine.slice(0, typedChars);
  const doneTyping = typedChars >= firstLine.length;

  return (
    <SceneWrapper durationInFrames={120}>
      <div style={{ transform: `translateY(${translateY}px)` }}>
        <AppWindow title="terminal — ls-confeccoes" rotateX={20} rotateY={rotY} width={940} height={600}>
          <div
            style={{
              background: "#0d0d0d",
              width: "100%",
              height: "100%",
              padding: 28,
              fontFamily: FONTS.mono,
              fontSize: 17,
              lineHeight: 1.55,
              color: THEME.accent,
            }}
          >
            <div style={{ color: THEME.white }}>
              {typed}
              {!doneTyping && <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>▋</span>}
            </div>
            {doneTyping &&
              LINES.slice(1).map((ln, i) => {
                const appearFrame = firstLine.length + 14 + i * 5;
                const op = interpolate(frame, [appearFrame, appearFrame + 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const isLogo = i >= 1 && i <= 3;
                const isOk = ln.includes("OK") || ln.includes("ON");
                return (
                  <div
                    key={i}
                    style={{
                      opacity: op,
                      color: isLogo ? THEME.accent : isOk ? THEME.white : THEME.muted,
                      fontWeight: isLogo ? 700 : 400,
                      whiteSpace: "pre",
                    }}
                  >
                    {ln}
                  </div>
                );
              })}
          </div>
        </AppWindow>
      </div>
    </SceneWrapper>
  );
};
