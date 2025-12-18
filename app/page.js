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
      <div style={{ maxWidth: 720, width: "100%" }}>
        <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
          Stealth mode · Private alpha
        </div>

        <h1 style={{ fontSize: 52, marginBottom: 14, letterSpacing: -1 }}>
          Parlee
        </h1>

        <p style={{ fontSize: 20, marginBottom: 18, lineHeight: 1.5 }}>
          A daily language ritual for adults who understand the language — but
          don’t speak fluently yet.
        </p>

        <p style={{ fontSize: 16, marginBottom: 18, color: "#444", lineHeight: 1.6 }}>
          Every day you get a zero-thinking plan:
          <br />
          <b>Story of the Day</b> (write about your life → AI rewrites naturally → saves vocab),
          <br />
          <b>Shadowing</b> (ready-to-repeat clips based on your interests — no searching).
        </p>

        <ul style={{ margin: "0 0 24px 18px", color: "#444", lineHeight: 1.8 }}>
          <li>15 minutes/day</li>
          <li>Personal vocabulary from your real life</li>
          <li>Consistency without planning or prep</li>
        </ul>

        <a
          href="mailto:hello@parlee.app?subject=Parlee%20alpha%20access&body=Hi!%20I%27d%20love%20to%20request%20alpha%20access.%0A%0AName:%0ALanguage:%0ALevel:%0A"
          style={{
            display: "inline-block",
            padding: "14px 18px",
            borderRadius: 10,
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Request access
        </a>

        <div style={{ marginTop: 14, fontSize: 13, color: "#777" }}>
          Private alpha. Early access is invite-only.
        </div>
      </div>
    </main>
  );
}
