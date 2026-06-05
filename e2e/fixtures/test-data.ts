/* ─── Shared E2E Test Data ─── */

export const TEST_TRANSFER = {
  amount: "100.00",
  recipient: "John Doe",
  description: "Test transfer",
};

export const INVALID_TRANSFERS = {
  negativeAmount: "-50.00",
  zeroAmount: "0",
  missingRecipient: "",
};

export const EXPECTED_BALANCE = "$15,000.50";

export const EXPECTED_TRANSACTIONS = {
  first: {
    description: "Payment to vendor",
    amount: "$1,500.00",
    status: "Completed",
    recipient: "Acme Corp",
  },
  pending: {
    description: "Transfer to savings",
    amount: "$250.00",
    status: "Pending",
    recipient: "Savings Account",
  },
  failed: {
    description: "Failed payment",
    amount: "$500.00",
    status: "Failed",
    recipient: "Electric Co",
  },
};
