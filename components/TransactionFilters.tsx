"use client";

import type { FilterStatus } from "@/lib/types";

const FILTERS: FilterStatus[] = ["All", "Pending", "Completed", "Failed"];

interface TransactionFiltersProps {
  activeFilter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
}

export function TransactionFilters({
  activeFilter,
  setFilter,
}: TransactionFiltersProps) {
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
