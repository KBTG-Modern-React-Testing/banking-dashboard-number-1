import { test, expect } from "@playwright/test";

test.describe("API Routes @api", () => {
  test.describe("GET /api/balance", () => {
    test("returns balance and currency", async ({ request }) => {
      const res = await request.get("/api/balance");
      expect(res.ok()).toBe(true);
      const data = await res.json();
      expect(data).toHaveProperty("balance");
      expect(data).toHaveProperty("currency", "USD");
    });

    test("balance is a non-negative number", async ({ request }) => {
      const res = await request.get("/api/balance");
      const data = await res.json();
      expect(typeof data.balance).toBe("number");
      expect(data.balance).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("GET /api/transactions", () => {
    test("returns array of transactions", async ({ request }) => {
      const res = await request.get("/api/transactions");
      expect(res.ok()).toBe(true);
      const data = await res.json();
      expect(data).toHaveProperty("transactions");
      expect(Array.isArray(data.transactions)).toBe(true);
      expect(data.transactions.length).toBeGreaterThan(0);
    });

    test("transactions are sorted newest first", async ({ request }) => {
      const res = await request.get("/api/transactions");
      const data = await res.json();
      const dates = data.transactions.map(
        (t: { createdAt: string }) => new Date(t.createdAt).getTime()
      );
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
      }
    });

    test("each transaction has required fields", async ({ request }) => {
      const res = await request.get("/api/transactions");
      const data = await res.json();
      for (const tx of data.transactions) {
        expect(tx).toHaveProperty("id");
        expect(tx).toHaveProperty("amount");
        expect(tx).toHaveProperty("currency");
        expect(tx).toHaveProperty("status");
        expect(tx).toHaveProperty("description");
        expect(tx).toHaveProperty("createdAt");
        expect(tx).toHaveProperty("updatedAt");
      }
    });

    test("status values are valid", async ({ request }) => {
      const res = await request.get("/api/transactions");
      const data = await res.json();
      const validStatuses = ["Pending", "Completed", "Failed"];
      for (const tx of data.transactions) {
        expect(validStatuses).toContain(tx.status);
      }
    });
  });

  test.describe("POST /api/transactions", () => {
    test("creates a new transaction with valid data", async ({ request }) => {
      const res = await request.post("/api/transactions", {
        data: {
          amount: 100,
          recipient: "Test User",
          description: "E2E Test",
        },
      });
      expect(res.status()).toBe(201);
      const data = await res.json();
      expect(data.transaction).toHaveProperty("status", "Pending");
      expect(data.transaction).toHaveProperty("amount", 100);
      expect(data.transaction).toHaveProperty("recipient", "Test User");
    });

    test("returns 400 for missing amount", async ({ request }) => {
      const res = await request.post("/api/transactions", {
        data: { recipient: "Test User" },
      });
      expect(res.status()).toBe(400);
    });

    test("returns 400 for negative amount", async ({ request }) => {
      const res = await request.post("/api/transactions", {
        data: { amount: -50, recipient: "Test User" },
      });
      expect(res.status()).toBe(400);
    });

    test("returns 400 for missing recipient", async ({ request }) => {
      const res = await request.post("/api/transactions", {
        data: { amount: 100 },
      });
      expect(res.status()).toBe(400);
    });

    test("returns 400 for empty recipient", async ({ request }) => {
      const res = await request.post("/api/transactions", {
        data: { amount: 100, recipient: "   " },
      });
      expect(res.status()).toBe(400);
    });
  });
});
