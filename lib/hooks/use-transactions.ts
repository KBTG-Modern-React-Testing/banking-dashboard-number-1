import { useQuery } from "@tanstack/react-query";
import type { TransactionsResponse } from "@/lib/types";

async function fetchTransactions(): Promise<TransactionsResponse> {
  const res = await fetch("/api/transactions");
  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return res.json();
}

export function useTransactions() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  return {
    transactions: data?.transactions ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
