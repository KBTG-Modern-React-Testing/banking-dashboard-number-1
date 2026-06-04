"use client";

import { useDashboard } from "@/components/DashboardContext";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function BalanceCard() {
  const { balance, isLoading } = useDashboard();

  return (
    <section
      id="balance-card"
      className="surface-card animate-fade-in"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Sunset gradient accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, var(--accent-sunset), var(--accent-dusk), var(--accent-twilight))",
        }}
      />

      {/* Eyebrow */}
      <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
        ACCOUNT BALANCE
      </span>

      {/* Balance amount */}
      {isLoading ? (
        <div
          style={{
            height: 48,
            width: 280,
            backgroundColor: "var(--canvas-mid)",
            borderRadius: 8,
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
      ) : (
        <h1
          className="text-display-md"
          style={{
            color: "var(--ink)",
            margin: 0,
            marginTop: 4,
          }}
        >
          {formatCurrency(balance)}
        </h1>
      )}

      {/* Currency label */}
      <span
        className="eyebrow-sm"
        style={{
          display: "block",
          marginTop: 12,
          color: "var(--body-mid)",
        }}
      >
        USD • AVAILABLE FUNDS
      </span>

      {/* Decorative background glow */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 122, 23, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
