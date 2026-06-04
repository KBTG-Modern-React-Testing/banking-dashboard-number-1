import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

// Helper component to test the hook
function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    vi.clearAllMocks();
  });

  it("defaults to dark theme", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
  });

  it("reads persisted theme from localStorage", () => {
    localStorage.setItem("banking-theme", "light");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("current-theme").textContent).toBe("light");
  });

  it("toggles theme from dark to light", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme").textContent).toBe("dark");

    await user.click(screen.getByText("Toggle"));

    expect(screen.getByTestId("current-theme").textContent).toBe("light");
  });

  it("toggles theme from light back to dark", async () => {
    localStorage.setItem("banking-theme", "light");
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme").textContent).toBe("light");

    await user.click(screen.getByText("Toggle"));

    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
  });

  it("persists theme choice to localStorage on toggle", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByText("Toggle"));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "banking-theme",
      "light"
    );
  });

  it("sets data-theme attribute on document.documentElement", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // After mount, should set dark
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    await user.click(screen.getByText("Toggle"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("throws error when useTheme is called outside provider", () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );

    spy.mockRestore();
  });
});
