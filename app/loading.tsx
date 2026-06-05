export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* Pulsing accent dot */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "var(--accent-sunset)",
            margin: "0 auto 16px",
            animation: "pulse-glow 1.5s ease-in-out infinite",
            boxShadow: "0 0 12px rgba(255, 122, 23, 0.4)",
          }}
        />
        <span
          className="eyebrow-sm"
          style={{ color: "var(--canvas-mid)" }}
        >
          LOADING
        </span>
      </div>
    </div>
  );
}
