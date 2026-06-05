"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="surface-card"
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Error accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, #f87171, #ef4444, #dc2626)",
          }}
        />

        <span
          className="eyebrow"
          style={{ display: "block", marginBottom: 12, color: "#f87171" }}
        >
          SOMETHING WENT WRONG
        </span>

        <p
          className="text-body-md"
          style={{ color: "var(--body-mid)", marginBottom: 24 }}
        >
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        <button onClick={() => reset()} className="btn-pill-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
