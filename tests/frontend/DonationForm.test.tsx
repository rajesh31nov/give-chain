import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DonationForm } from "@/components/campaigns/DonationForm";
import { useWalletStore } from "@/store/walletStore";

describe("DonationForm Component", () => {
  it("renders preset amount buttons and updates custom input", () => {
    useWalletStore.setState({
      address: "GABC1234567890XYZ",
      isConnected: true,
    });

    render(<DonationForm campaignId="1" campaignTitle="Flood Relief 2026" />);

    const input = screen.getByLabelText(/donation amount/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const preset100 = screen.getByRole("button", { name: "100 XLM" });
    fireEvent.click(preset100);

    expect(input.value).toBe("100");
  });

  it("prompts for wallet connection when disconnected", () => {
    useWalletStore.setState({
      address: null,
      isConnected: false,
    });

    render(<DonationForm campaignId="1" campaignTitle="Flood Relief 2026" />);
    expect(screen.getByRole("button", { name: /connect wallet to donate/i })).toBeInTheDocument();
  });
});
