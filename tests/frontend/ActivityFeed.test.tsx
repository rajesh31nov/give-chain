import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ActivityItem } from "@/components/activity/ActivityItem";
import { NormalizedEvent } from "@/types";

describe("ActivityItem Component", () => {
  const mockEvent: NormalizedEvent = {
    id: "tx-101-1",
    type: "donation_received",
    timestamp: Date.now() - 1000 * 60 * 5,
    ledger: 1048200,
    transactionHash: "a1b2c3d4e5f67890a1b2c3d4e5f67890",
    contractId: "CCAMP123",
    campaignId: "1",
    actor: "GABC1234567890XYZ",
    amount: "100",
    metadata: { campaignTitle: "Flood Relief 2026" },
  };

  it("renders donation event title, amount, campaign title, and Stellar Expert Explorer link", () => {
    render(<ActivityItem event={mockEvent} />);

    expect(screen.getByText("Donation Received")).toBeInTheDocument();
    expect(screen.getByText("Flood Relief 2026")).toBeInTheDocument();
    expect(screen.getByText(/100 XLM contributed by GABC...0XYZ/i)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /explorer/i });
    expect(link).toHaveAttribute(
      "href",
      "https://stellar.expert/explorer/testnet/tx/a1b2c3d4e5f67890a1b2c3d4e5f67890"
    );
  });
});
