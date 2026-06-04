"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState, useCallback } from "react";

export function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <nav
      id="nav-bar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--canvas)",
        borderBottom: "1px solid var(--hairline)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Accent dot */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "var(--accent-sunset)",
              boxShadow: "0 0 8px rgba(255, 122, 23, 0.4)",
            }}
          />
          <span
            className="text-caption-mono"
            style={{
              color: "var(--ink)",
              fontSize: 14,
              letterSpacing: "1.4px",
            }}
          >
            BANKING
          </span>
        </div>

        {/* Desktop nav links */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span className="eyebrow-sm" style={{ marginRight: 8 }}>
            DASHBOARD
          </span>

          {/* Theme toggle */}
          <button
            id="theme-toggle"
            onClick={handleToggle}
            className="btn-pill-outline-sm"
            aria-label={
              theme === "dark" ? "switch to light mode" : "switch to dark mode"
            }
            style={{ minWidth: 0, padding: "4px 12px" }}
          >
            {theme === "dark" ? (
              <>
                <Sun size={14} /> Light Mode
              </>
            ) : (
              <>
                <Moon size={14} /> Dark Mode
              </>
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--ink)",
            cursor: "pointer",
            padding: 4,
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-dropdown"
          style={{
            padding: "8px 24px 16px",
            borderTop: "1px solid var(--hairline)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span className="eyebrow-sm">DASHBOARD</span>
          <button
            onClick={() => {
              handleToggle();
              setMobileMenuOpen(false);
            }}
            className="btn-pill-outline-sm"
            aria-label={
              theme === "dark" ? "switch to light mode" : "switch to dark mode"
            }
            style={{ width: "fit-content" }}
          >
            {theme === "dark" ? (
              <>
                <Sun size={14} /> Light Mode
              </>
            ) : (
              <>
                <Moon size={14} /> Dark Mode
              </>
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-menu-dropdown {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
