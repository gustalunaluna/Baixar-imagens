import React from "react";
import { THEME, FONTS } from "../theme";

export const AppWindow: React.FC<{
  title?: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  rotateX?: number;
  rotateY?: number;
}> = ({ title = "LS Confecções", children, width = 940, height = 600, rotateX = 0, rotateY = 0 }) => {
  return (
    <div
      style={{
        width,
        height,
        background: THEME.surface,
        borderRadius: 14,
        border: `1px solid ${THEME.border}`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
        overflow: "hidden",
        transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 38,
          background: THEME.surface2,
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            color: THEME.dim,
            fontSize: 13,
            fontFamily: FONTS.ui,
            marginRight: 50,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};
