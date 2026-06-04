"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useDashboard } from "@/components/DashboardContext";
import { Send, Loader2 } from "lucide-react";

interface FormErrors {
  amount?: string;
  recipient?: string;
}

export function TransferForm() {
  const { addTransaction } = useDashboard();

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      errs.amount = "Amount is required and must be a number";
    } else if (numAmount <= 0) {
      errs.amount = "Amount must be greater than zero";
    }

    if (!recipient.trim()) {
      errs.recipient = "Recipient is required";
    }

    return errs;
  }, [amount, recipient]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSuccessMessage("");

      const errs = validate();
      setErrors(errs);

      if (Object.keys(errs).length > 0) return;

      setIsSubmitting(true);
      try {
        await addTransaction({
          amount: parseFloat(amount),
          recipient: recipient.trim(),
          description: description.trim() || undefined,
        });

        // Clear form on success
        setAmount("");
        setRecipient("");
        setDescription("");
        setErrors({});
        setSuccessMessage("Transfer initiated successfully");

        // Clear success message after 3s
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setErrors({
          amount:
            err instanceof Error ? err.message : "Transfer failed. Try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [amount, recipient, description, validate, addTransaction]
  );

  return (
    <section
      id="transfer-form"
      className="surface-card animate-fade-in"
      style={{ animationDelay: "100ms", position: "relative", overflow: "hidden" }}
    >
      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, var(--accent-dusk), var(--accent-twilight), var(--accent-breeze))",
        }}
      />

      {/* Eyebrow */}
      <span
        className="eyebrow"
        style={{ display: "block", marginBottom: 20 }}
      >
        TRANSFER FUNDS
      </span>

      <form onSubmit={handleSubmit} noValidate>
        {/* Amount */}
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="transfer-amount"
            className="eyebrow-sm"
            style={{
              display: "block",
              marginBottom: 8,
              color: "var(--body-mid)",
            }}
          >
            AMOUNT (USD)
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--body-mid)",
                fontSize: 16,
                pointerEvents: "none",
              }}
            >
              $
            </span>
            <input
              id="transfer-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              className="input-field"
              aria-invalid={!!errors.amount}
              style={{ paddingLeft: 32 }}
            />
          </div>
          {errors.amount && (
            <p
              role="alert"
              style={{
                color: "#f87171",
                fontSize: 13,
                marginTop: 6,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.5px",
              }}
            >
              {errors.amount}
            </p>
          )}
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="transfer-recipient"
            className="eyebrow-sm"
            style={{
              display: "block",
              marginBottom: 8,
              color: "var(--body-mid)",
            }}
          >
            RECIPIENT
          </label>
          <input
            id="transfer-recipient"
            type="text"
            placeholder="Enter recipient name"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              if (errors.recipient)
                setErrors((prev) => ({ ...prev, recipient: undefined }));
            }}
            className="input-field"
            aria-invalid={!!errors.recipient}
          />
          {errors.recipient && (
            <p
              role="alert"
              style={{
                color: "#f87171",
                fontSize: 13,
                marginTop: 6,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.5px",
              }}
            >
              {errors.recipient}
            </p>
          )}
        </div>

        {/* Description (optional) */}
        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="transfer-description"
            className="eyebrow-sm"
            style={{
              display: "block",
              marginBottom: 8,
              color: "var(--body-mid)",
            }}
          >
            DESCRIPTION{" "}
            <span style={{ color: "var(--canvas-mid)", letterSpacing: "normal" }}>
              (optional)
            </span>
          </label>
          <input
            id="transfer-description"
            type="text"
            placeholder="Add a note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-pill-primary"
          style={{
            width: "100%",
            padding: "10px 16px",
            fontSize: 14,
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={16}
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />
              Processing...
            </>
          ) : (
            <>
              <Send size={14} />
              Transfer
            </>
          )}
        </button>

        {/* Success message */}
        {successMessage && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: 16,
              padding: "10px 16px",
              borderRadius: 8,
              backgroundColor: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              color: "#34d399",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.5px",
              textAlign: "center",
            }}
          >
            ✓ {successMessage}
          </div>
        )}
      </form>

      {/* Spin animation for loader */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
