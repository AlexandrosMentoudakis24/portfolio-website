import { getPortfolio, getResumeStatus } from "@/lib/portfolio";
import Portfolio from "@/components/Portfolio";

export const dynamic = "force-dynamic";

function UnderConstruction() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        background: "#0a0a0a",
        color: "#e8e8e8",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 4rem)",
          fontWeight: 700,
          marginBottom: "1rem",
        }}
      >
        Under Construction
      </h1>
      <p style={{ fontSize: "1.25rem", color: "#888", maxWidth: "400px" }}>
        We&apos;re currently updating the site. Please check back later.
      </p>
      <div
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          border: "1px solid #333",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "0.875rem",
          color: "#666",
        }}
      >
        Portfolio service unavailable
      </div>
    </div>
  );
}

export default async function Home() {
  try {
    const [data, resume] = await Promise.all([
      getPortfolio(),
      getResumeStatus(),
    ]);
    return <Portfolio data={data} resume={resume} />;
  } catch {
    return <UnderConstruction />;
  }
}
