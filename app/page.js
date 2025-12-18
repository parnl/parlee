export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        fontFamily: "system-ui",
        background: "#ffffff",
      }}
    >
      <div style={{ maxWidth: 640, width: "100%" }}>
        <h1 style={{ fontSize: 48, marginBottom: 16 }}>
          Parlee
        </h1>

        <p style={{ fontSize: 20, marginBottom: 24, lineHeight: 1.5 }}>
          A daily video companion for founders building in public on LinkedIn.
        </p>

        <p style={{ fontSize: 16, marginBottom: 24, color: "#444" }}>
          We’re building a simple system that helps you stay consistent:
          one focused prompt per day, a short video reply, and continuity over weeks.
        </p>

        <p
          style={{
            fontSize: 14,
            marginBottom: 32,
            color: "#666",
          }}
        >
          🚧 Stealth mode · Private alpha
        </p>

        <button
          style={{
            padding: "12px 20px",
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #000",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.href = "mailto:hello@parlee.app?subject=Parlee early access";
          }}
        >
          Request access
        </button>

        <p
          style={{
            fontSize: 12,
            marginTop: 24,
            color: "#777",
          }}
        >
          Not publicly available yet. Built with a small group of B2B founders.
        </p>
      </div>
    </main>
  );
}

