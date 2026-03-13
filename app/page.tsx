"use client";
import { useState } from "react";

const tagColor = (tag: string) => {
  if (tag.includes("매운")) return "#ff6b6b";
  if (tag.includes("채식")) return "#51cf66";
  if (tag.includes("해산물")) return "#339af0";
  if (tag.includes("디저트")) return "#f783ac";
  if (tag.includes("고기")) return "#ff922b";
  return "#868e96";
};

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setImage((ev.target?.result as string).split(",")[1]);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("분석 중 오류가 발생했어요. 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", padding: "24px 16px", background: "#fff", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 40 }}>🍜</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "8px 0 4px", color: "#1a1a1a" }}>MenuLens</h1>
        <p style={{ color: "#888", fontSize: 14, margin: 0 }}>메뉴판 사진으로 현지 음식 완전 정복</p>
      </div>

      <label style={{ display: "block", cursor: "pointer" }}>
        <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
        <div style={{ border: "2px dashed #e0e0e0", borderRadius: 16, padding: 20, textAlign: "center", background: preview ? "#fff" : "#fafafa" }}>
          {preview
            ? <img src={preview} alt="menu" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 10, objectFit: "contain" }} />
            : <><div style={{ fontSize: 36, marginBottom: 8 }}>📷</div><p style={{ color: "#aaa", margin: 0, fontSize: 14 }}>메뉴판 사진을 업로드하세요</p></>
          }
        </div>
      </label>

      {preview && !loading && (
        <button onClick={analyze} style={{ width: "100%", marginTop: 14, padding: 14, background: "linear-gradient(135deg, #ff6b35, #f7c59f)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          🔍 메뉴 분석하기
        </button>
      )}

      {loading && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <div style={{ fontSize: 36, display: "inline-block", animation: "spin 1s linear infinite" }}>🔄</div>
          <p style={{ color: "#888", marginTop: 8 }}>AI가 메뉴를 분석하고 있어요...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {error && <p style={{ color: "#ff6b6b", textAlign: "center", marginTop: 16 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ background: "linear-gradient(135deg, #fff3e0, #ffe0b2)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px", color: "#e65100" }}>⭐ 오늘의 추천 Top 3</h2>
            {result.recommendations?.map((r: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ fontWeight: 800, color: "#ff6b35", fontSize: 16, minWidth: 20 }}>{i + 1}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{r.item}</p>
                  <p style={{ margin: "2px 0 0", color: "#777", fontSize: 13 }}>{r.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#1a1a1a" }}>📋 전체 메뉴</h2>
          {result.items?.map((item: any, i: number) => (
            <div key={i} style={{ border: "1px solid #f0f0f0", borderRadius: 14, padding: 14, marginBottom: 10, background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{item.translated}</span>
                <span style={{ color: "#aaa", fontSize: 12 }}>{item.original}</span>
              </div>
              <p style={{ margin: "0 0 8px", color: "#555", fontSize: 13, lineHeight: 1.5 }}>{item.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.tags?.map((tag: string, j: number) => (
                  <span key={j} style={{ background: tagColor(tag), color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
