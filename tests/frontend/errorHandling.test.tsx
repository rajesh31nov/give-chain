import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { TransactionRecord } from "@/types";

describe("Application Error State Handling", () => {
  it("displays user-friendly failure messages when transaction execution reverts", () => {
    const failedTx: TransactionRecord = {
      hash: "errhash1234567890",
      type: "Donation",
      amount: "50",
      status: "failed",
      timestamp: Date.now(),
      error: "User rejected transaction signature in Freighter wallet.",
    };

    render(<TransactionCard tx={failedTx} />);

    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(
      screen.getByText("User rejected transaction signature in Freighter wallet.")
    ).toBeInTheDocument();
  });
});
