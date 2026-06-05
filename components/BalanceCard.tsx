"use client";

import { useBalance } from "@/lib/hooks/use-balance";
import { formatCurrency } from "@/lib/formatters";
import { RefreshCw } from "lucide-react";

export function BalanceCard() {
  const { balance, isLoading, isError, refetch } = useBalance();

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
          background: isError
            ? "linear-gradient(90deg, #f87171, #ef4444, #dc2626)"
            : "linear-gradient(90deg, var(--accent-sunset), var(--accent-dusk), var(--accent-twilight))",
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
      ) : isError ? (
        <div role="alert">
          <h1
            className="text-display-md"
            style={{
              color: "var(--body-mid)",
              margin: 0,
              marginTop: 4,
            }}
          >
            $ —
          </h1>
          <p
            style={{
              color: "#f87171",
              fontSize: 13,
              marginTop: 8,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.5px",
            }}
          >
            Unable to load balance
          </p>
          <button
            onClick={() => refetch()}
            className="btn-pill-outline-sm"
            style={{
              marginTop: 8,
              color: "#f87171",
              borderColor: "rgba(248, 113, 113, 0.3)",
            }}
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
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
