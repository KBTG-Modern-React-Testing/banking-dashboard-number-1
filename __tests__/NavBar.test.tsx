import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavBar } from "@/components/NavBar";
import { ThemeProvider } from "@/components/ThemeProvider";

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <NavBar />
    </ThemeProvider>
  );
}

describe("NavBar", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    vi.clearAllMocks();
  });

  it("displays the BANKING brand text", () => {
    renderWithTheme();
    const brandTexts = screen.getAllByText("BANKING");
    expect(brandTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("displays the DASHBOARD label", () => {
    renderWithTheme();
    const dashboardLabels = screen.getAllByText("DASHBOARD");
    expect(dashboardLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("has a theme toggle button", () => {
    renderWithTheme();
    const toggleBtns = screen.getAllByRole("button", {
      name: /switch to light mode/i,
    });
    expect(toggleBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Light Mode' text when in dark mode (default)", () => {
    renderWithTheme();
    const lightLabels = screen.getAllByText("Light Mode");
    expect(lightLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("switches to show 'Dark Mode' text after clicking toggle", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const toggleBtns = screen.getAllByRole("button", {
      name: /switch to light mode/i,
    });
    await user.click(toggleBtns[0]);

    const darkLabels = screen.getAllByText("Dark Mode");
    expect(darkLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("theme toggle button has accessible aria-label", () => {
    renderWithTheme();
    const toggleBtns = screen.getAllByRole("button", {
      name: /switch to light mode/i,
    });
    expect(toggleBtns[0].getAttribute("aria-label")).toBe(
      "switch to light mode"
    );
  });

  it("updates aria-label after toggling theme", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const toggleBtns = screen.getAllByRole("button", {
      name: /switch to light mode/i,
    });
    await user.click(toggleBtns[0]);

    const darkBtns = screen.getAllByRole("button", {
      name: /switch to dark mode/i,
    });
    expect(darkBtns[0].getAttribute("aria-label")).toBe("switch to dark mode");
  });

  it("has a hamburger menu button for mobile", () => {
    renderWithTheme();
    // The hamburger button has display:none at desktop width (jsdom doesn't do CSS),
    // so it's hidden from the a11y tree. Query by aria-label attribute directly.
    const menuBtn = document.querySelector('[aria-label="Toggle menu"]');
    expect(menuBtn).not.toBeNull();
    expect(menuBtn?.tagName).toBe("BUTTON");
  });
});
