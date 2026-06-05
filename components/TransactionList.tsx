"use client";

import { useState, useCallback } from "react";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { TransactionFilters } from "@/components/TransactionFilters";
import { ArrowUpRight, ArrowDownLeft, AlertCircle, RefreshCw } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Transaction, FilterStatus } from "@/lib/types";

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

      {/* Description & recipient & date */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 2,
          }}
        >
          {tx.recipient && (
            <span
              className="text-caption-mono-sm"
              style={{
                color: "var(--body-mid)",
                fontSize: 11,
              }}
            >
              {tx.recipient}
            </span>
          )}
          {tx.recipient && (
            <span style={{ color: "var(--canvas-mid)", fontSize: 11 }}>•</span>
          )}
          <span
            style={{
              color: "var(--canvas-mid)",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.5px",
            }}
          >
            {formatDate(tx.createdAt)}
          </span>
        </div>
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
  const { transactions, isLoading, isError, refetch } = useTransactions();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");

  const setFilter = useCallback((filter: FilterStatus) => {
    setActiveFilter(filter);
  }, []);

  const filteredTransactions =
    activeFilter === "All"
      ? transactions
      : transactions.filter((tx) => tx.status === activeFilter);

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

        <TransactionFilters activeFilter={activeFilter} setFilter={setFilter} />
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
      ) : isError ? (
        <div
          role="alert"
          style={{
            padding: "48px 0",
            textAlign: "center",
          }}
        >
          <AlertCircle
            size={32}
            color="#f87171"
            style={{ margin: "0 auto 12px" }}
          />
          <div
            className="text-body-md"
            style={{ color: "#f87171", marginBottom: 4 }}
          >
            Unable to load transactions
          </div>
          <div
            className="text-caption-mono-sm"
            style={{ color: "var(--body-mid)", marginBottom: 16 }}
          >
            PLEASE CHECK YOUR CONNECTION AND TRY AGAIN
          </div>
          <button
            onClick={() => refetch()}
            className="btn-pill-outline-sm"
            style={{
              color: "#f87171",
              borderColor: "rgba(248, 113, 113, 0.3)",
            }}
          >
            <RefreshCw size={12} />
            Retry
          </button>
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
