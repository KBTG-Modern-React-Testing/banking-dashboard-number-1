/* ─── Shared Types ─── */

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

export interface BalanceResponse {
  balance: number;
  currency: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
}
