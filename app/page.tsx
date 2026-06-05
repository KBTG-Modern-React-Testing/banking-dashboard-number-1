import { NavBar } from "@/components/NavBar";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";
import { TransferForm } from "@/components/TransferForm";

export default function Home() {
  return (
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
  );
}
