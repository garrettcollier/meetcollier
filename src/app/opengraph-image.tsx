import { ImageResponse } from "next/og";

export const alt = "Meet Collier — Public Service. Personal Connection.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ alignItems: "stretch", background: "#fbfaf7", color: "#071a2b", display: "flex", height: "100%", width: "100%" }}><div style={{ background: "#071a2b", display: "flex", width: 72 }} /><div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "72px 80px" }}><div style={{ color: "#1c568f", display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Public Service. Personal Connection.</div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: "-0.055em" }}>MEETCOLLIER.</div><div style={{ display: "flex", fontSize: 38, marginTop: 24 }}>Your voice. Your community. Your government.</div></div><div style={{ display: "flex", fontSize: 24, color: "#345d78" }}>An independent community platform · Hot Springs, Arkansas</div></div></div>, size);
}
