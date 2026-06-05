import { vi } from 'vitest';

interface MockFetchOptions {
  balance?: number;
  transactions?: Array<{ id: string; amount: number; currency: string; status: string; description: string; recipient?: string; createdAt: string; updatedAt: string }>;
  balanceFail?: boolean;
  transactionsFail?: boolean;
  postFail?: boolean;
  postNetworkError?: boolean;
}

export function mockFetchResponses(options: MockFetchOptions = {}) {
  const {
    balance = 15000.5,
    transactions = [],
    balanceFail = false,
    transactionsFail = false,
    postFail = false,
    postNetworkError = false,
  } = options;

  (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
    (url: string, init?: RequestInit) => {
      if (typeof url === 'string' && url.includes('/api/balance')) {
        if (balanceFail) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ balance, currency: 'USD' }),
        });
      }
      if (typeof url === 'string' && url.includes('/api/transactions')) {
        if (init?.method === 'POST') {
          if (postNetworkError) {
            return Promise.reject(new TypeError('Failed to fetch'));
          }
          if (postFail) {
            return Promise.resolve({
              ok: false,
              json: () => Promise.resolve({ error: 'Transfer failed' }),
            });
          }
          return Promise.resolve({
            ok: true,
            status: 201,
            json: () => Promise.resolve({
              transaction: {
                id: 'txn_new',
                amount: 100,
                currency: 'USD',
                status: 'Pending',
                description: 'Test transfer',
                recipient: 'Test User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }),
          });
        }
        if (transactionsFail) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ transactions }),
        });
      }
      return Promise.resolve({ ok: false });
    }
  );
}
