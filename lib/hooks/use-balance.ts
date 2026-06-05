import { useQuery } from "@tanstack/react-query";
import type { BalanceResponse } from "@/lib/types";

async function fetchBalance(): Promise<BalanceResponse> {
  const res = await fetch("/api/balance");
  if (!res.ok) {
    throw new Error("Failed to fetch balance");
  }
  return res.json();
}

export function useBalance() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
  });

  return {
    balance: data?.balance ?? 0,
    currency: data?.currency ?? "USD",
    isLoading,
    isError,
    error,
    refetch,
  };
}
