"use client";

import { useDashboard, type Transaction } from "@/components/DashboardContext";
import { TransactionFilters } from "@/components/TransactionFilters";
import { ArrowUpRight, ArrowDownLeft, AlertCircle } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const badgeClass =
    status === "Pending"
      ? "badge-pending"
      : status === "Completed"
      ? "badge-completed"
      : "badge-failed";

  return <span className={badgeClass}>{status}</span>;
}

function StatusIcon({ status }: { status: Transaction["status"] }) {
  const iconStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  if (status === "Completed") {
    return (
      <div
        style={{
          ...iconStyle,
          backgroundColor: "rgba(52, 211, 153, 0.1)",
        }}
      >
        <ArrowDownLeft size={16} color="#34d399" />
      </div>
    );
  }
  if (status === "Pending") {
    return (
      <div
        style={{
          ...iconStyle,
          backgroundColor: "rgba(255, 122, 23, 0.1)",
        }}
      >
        <ArrowUpRight size={16} color="var(--accent-sunset)" />
      </div>
    );
  }
  return (
    <div
      style={{
        ...iconStyle,
        backgroundColor: "rgba(248, 113, 113, 0.1)",
      }}
    >
      <AlertCircle size={16} color="#f87171" />
    </div>
  );
}

function TransactionRow({ tx, index }: { tx: Transaction; index: number }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 0",
        borderBottom: "1px solid var(--hairline)",
        animationDelay: `${index * 50}ms`,
      }}
    >
      <StatusIcon status={tx.status} />

      {/* Description & recipient */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="text-body-sm"
          style={{
            color: "var(--ink)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {tx.description}
        </div>
        {tx.recipient && (
          <div
            className="text-caption-mono-sm"
            style={{
              color: "var(--body-mid)",
              marginTop: 2,
              fontSize: 11,
            }}
          >
            {tx.recipient}
          </div>
        )}
      </div>

      {/* Amount & status */}
      <div
        style={{
          textAlign: "right",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <span
          className="text-body-sm"
          style={{
            color: "var(--ink)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatCurrency(tx.amount)}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <StatusBadge status={tx.status} />
        </div>
      </div>
    </div>
  );
}

export function TransactionList() {
  const { filteredTransactions, isLoading, activeFilter } = useDashboard();

  return (
    <section
      id="transaction-list"
      className="surface-card animate-slide-up"
      style={{ animationDelay: "150ms" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span className="eyebrow">TRANSACTIONS</span>
          <span
            className="eyebrow-sm"
            style={{ color: "var(--body-mid)" }}
          >
            {filteredTransactions.length}{" "}
            {filteredTransactions.length === 1 ? "ITEM" : "ITEMS"}
          </span>
        </div>

        <TransactionFilters />
      </div>

      {/* Divider */}
      <hr className="divider-hairline" style={{ margin: 0 }} />

      {/* Transaction rows */}
      {isLoading ? (
        <div style={{ padding: "32px 0" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 0",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "var(--canvas-mid)",
                  animation: "pulse-glow 2s ease-in-out infinite",
                  animationDelay: `${i * 100}ms`,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 14,
                    width: `${60 + i * 10}%`,
                    backgroundColor: "var(--canvas-mid)",
                    borderRadius: 4,
                    animation: "pulse-glow 2s ease-in-out infinite",
                    animationDelay: `${i * 150}ms`,
                  }}
                />
              </div>
              <div
                style={{
                  height: 14,
                  width: 80,
                  backgroundColor: "var(--canvas-mid)",
                  borderRadius: 4,
                  animation: "pulse-glow 2s ease-in-out infinite",
                  animationDelay: `${i * 200}ms`,
                }}
              />
            </div>
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div
          style={{
            padding: "48px 0",
            textAlign: "center",
          }}
        >
          <div
            className="text-body-md"
            style={{ color: "var(--body-mid)", marginBottom: 4 }}
          >
            No transactions
          </div>
          <div
            className="text-caption-mono-sm"
            style={{ color: "var(--canvas-mid)" }}
          >
            {activeFilter !== "All"
              ? `NO ${activeFilter.toUpperCase()} TRANSACTIONS FOUND`
              : "YOUR TRANSACTION HISTORY WILL APPEAR HERE"}
          </div>
        </div>
      ) : (
        <div>
          {filteredTransactions.map((tx, i) => (
            <TransactionRow key={tx.id} tx={tx} index={i} />
          ))}
        </div>
      )}

      {/* Date footer */}
      {filteredTransactions.length > 0 && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="eyebrow-sm" style={{ color: "var(--canvas-mid)" }}>
            MOST RECENT:{" "}
            {formatDate(filteredTransactions[0]?.createdAt || "")}
          </span>
        </div>
      )}
    </section>
  );
}
