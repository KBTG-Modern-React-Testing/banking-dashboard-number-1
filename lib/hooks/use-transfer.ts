import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Transaction, TransferPayload, BalanceResponse } from "@/lib/types";

async function postTransfer(
  payload: TransferPayload
): Promise<{ transaction: Transaction }> {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Transfer failed" }));
    throw new Error(err.error || "Transfer failed");
  }

  return res.json();
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTransfer,
    onMutate: async (payload) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["balance"] });

      // Snapshot current balance for rollback
      const previousBalance = queryClient.getQueryData<BalanceResponse>([
        "balance",
      ]);

      // Optimistically deduct balance
      if (previousBalance) {
        queryClient.setQueryData<BalanceResponse>(["balance"], {
          ...previousBalance,
          balance: Math.max(0, previousBalance.balance - payload.amount),
        });
      }

      return { previousBalance };
    },
    onError: (_err, _payload, context) => {
      // Roll back the optimistic update
      if (context?.previousBalance) {
        queryClient.setQueryData(["balance"], context.previousBalance);
      }
    },
    onSettled: () => {
      // Refetch both to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
