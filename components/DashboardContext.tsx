"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ─── Types ─── */

export type TransactionStatus = "Pending" | "Completed" | "Failed";
export type FilterStatus = "All" | TransactionStatus;

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  recipient?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferPayload {
  amount: number;
  recipient: string;
  description?: string;
}

interface DashboardContextValue {
  balance: number;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  activeFilter: FilterStatus;
  isLoading: boolean;
  setFilter: (filter: FilterStatus) => void;
  addTransaction: (payload: TransferPayload) => Promise<void>;
}

/* ─── Context ─── */

const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined
);

/* ─── Provider ─── */

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("All");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [balanceRes, txRes] = await Promise.all([
          fetch("/api/balance"),
          fetch("/api/transactions"),
        ]);
        if (balanceRes.ok) {
          const balData = await balanceRes.json();
          setBalance(balData.balance);
        }
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.transactions);
        }
      } catch {
        // API unavailable — keep defaults
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter transactions client-side
  const filteredTransactions =
    activeFilter === "All"
      ? transactions
      : transactions.filter((tx) => tx.status === activeFilter);

  const setFilter = useCallback((filter: FilterStatus) => {
    setActiveFilter(filter);
  }, []);

  const addTransaction = useCallback(
    async (payload: TransferPayload) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Transfer failed");
      }

      const { transaction } = await res.json();

      // Add to front of list (newest first)
      setTransactions((prev) => [transaction, ...prev]);

      // Deduct from balance (pending deduction for UX feedback)
      setBalance((prev) => Math.max(0, prev - payload.amount));
    },
    []
  );

  return (
    <DashboardContext.Provider
      value={{
        balance,
        transactions,
        filteredTransactions,
        activeFilter,
        isLoading,
        setFilter,
        addTransaction,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}
