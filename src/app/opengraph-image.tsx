import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Parcoursup Décrypté — Parcoursup, enfin compréhensible.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const jetons = ["B1", "C1", "C2", "C3", "B2", "C4", "C5", "C6"];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0a1020", color: "#eef1f8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#2dd4bf", letterSpacing: 4, textTransform: "uppercase" }}>
          Observatoire citoyen indépendant
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>Parcoursup,</div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, color: "#8fb0ff" }}>enfin compréhensible.</div>
          <div style={{ fontSize: 30, color: "#c3cbdd", marginTop: 12 }}>Classement, ordre d'appel, listes d'attente : expliqués à partir du code officiel.</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {jetons.map((j) => (
            <div key={j} style={{ width: 88, height: 88, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, background: j.startsWith("B") ? "#f2b33d" : "#17223b", color: j.startsWith("B") ? "#2b1a00" : "#eef1f8", border: "2px solid #34425f" }}>
              {j}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
