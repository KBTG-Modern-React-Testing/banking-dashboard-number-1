"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { NavBar } from "@/components/NavBar";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";
import { TransferForm } from "@/components/TransferForm";
import { DashboardProvider } from "@/components/DashboardContext";

export default function Home() {
  return (
    <ThemeProvider>
    <DashboardProvider>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--canvas)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavBar />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            maxWidth: 1200,
            width: "100%",
            margin: "0 auto",
            padding: "32px 24px 64px",
          }}
        >
          {/* Dashboard grid */}
          <div className="dashboard-grid">
            {/* Left column: Balance + Transfer */}
            <div className="dashboard-col-left">
              <BalanceCard />
              <div style={{ height: 24 }} />
              <TransferForm />
            </div>

            {/* Right column: Transactions */}
            <div className="dashboard-col-right">
              <TransactionList />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--hairline)",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <span
            className="eyebrow-sm"
            style={{ color: "var(--canvas-mid)" }}
          >
            MODERN BANKING DASHBOARD • {new Date().getFullYear()}
          </span>
        </footer>
      </div>

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 380px 1fr;
            gap: 32px;
          }
        }

        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 420px 1fr;
          }
        }

        .dashboard-col-left {
          display: flex;
          flex-direction: column;
        }

        .dashboard-col-right {
          min-width: 0;
        }
      `}</style>
    </DashboardProvider>
    </ThemeProvider>
  );
}
