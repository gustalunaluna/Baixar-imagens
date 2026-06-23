import React from "react";
import { Composition, Series, Audio, AbsoluteFill, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "./theme";
import { Scene1Terminal } from "./scenes/Scene1Terminal";
import { Scene2Home } from "./scenes/Scene2Home";
import { Scene3Chat } from "./scenes/Scene3Chat";
import { Scene4Products } from "./scenes/Scene4Products";
import { Scene5Customization } from "./scenes/Scene5Customization";
import { Scene6Brands } from "./scenes/Scene6Brands";
import { Scene7Combo } from "./scenes/Scene7Combo";
import { Scene8CTA } from "./scenes/Scene8CTA";

const D = {
  s1: 120, s2: 150, s3: 160, s4: 130,
  s5: 140, s6: 120, s7: 180, s8: 120,
};
export const TOTAL = Object.values(D).reduce((a, b) => a + b, 0); // 1120 frames ≈ 37.3s

const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - fps * 2, durationInFrames], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const volume = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ background: THEME.bg }}>
      <Audio src={staticFile("music.mp3")} volume={volume} />

      <Series>
        <Series.Sequence durationInFrames={D.s1}><Scene1Terminal /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s2}><Scene2Home /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s3}><Scene3Chat /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s4}><Scene4Products /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s5}><Scene5Customization /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s6}><Scene6Brands /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s7}><Scene7Combo /></Series.Sequence>
        <Series.Sequence durationInFrames={D.s8}><Scene8CTA /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LSConfeccoes"
      component={Main}
      durationInFrames={TOTAL}
      fps={30}
      width={1080}
      height={700}
    />
  );
};
