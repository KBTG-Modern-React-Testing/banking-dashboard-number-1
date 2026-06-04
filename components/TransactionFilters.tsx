"use client";

import { useDashboard, type FilterStatus } from "@/components/DashboardContext";

const FILTERS: FilterStatus[] = ["All", "Pending", "Completed", "Failed"];

export function TransactionFilters() {
  const { activeFilter, setFilter } = useDashboard();

  return (
    <div
      id="transaction-filters"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => setFilter(filter)}
            className={isActive ? "btn-pill-outline-sm active" : "btn-pill-outline-sm"}
            aria-pressed={isActive}
            style={{
              transition: "all 0.15s ease",
            }}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
