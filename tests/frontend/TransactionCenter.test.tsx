import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { TransactionRecord } from "@/types";

describe("TransactionCard Component", () => {
  const mockConfirmedTx: TransactionRecord = {
    hash: "a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890",
    type: "Donation",
    campaignTitle: "Flood Relief 2026",
    amount: "100",
    status: "confirmed",
    timestamp: Date.now() - 60000,
  };

  const mockFailedTx: TransactionRecord = {
    hash: "f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5",
    type: "Donation",
    campaignTitle: "Medical Aid Fund",
    amount: "50",
    status: "failed",
    timestamp: Date.now() - 120000,
    error: "Soroban execution reverted",
  };

  it("renders confirmed transaction badge and Stellar Explorer link", () => {
    render(<TransactionCard tx={mockConfirmedTx} />);

    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Donation")).toBeInTheDocument();
    expect(screen.getByText("Amount: 100 XLM")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /stellar explorer/i });
    expect(link).toHaveAttribute(
      "href",
      "https://stellar.expert/explorer/testnet/tx/a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890"
    );
  });

  it("renders failed transaction with error message and triggers retry", () => {
    const handleRetry = vi.fn();
    render(<TransactionCard tx={mockFailedTx} onRetry={handleRetry} />);

    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Soroban execution reverted")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /retry tx/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledWith(mockFailedTx);
  });
});
