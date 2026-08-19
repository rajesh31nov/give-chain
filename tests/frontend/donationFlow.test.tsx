import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DonationForm } from "@/components/campaigns/DonationForm";
import { useWalletStore } from "@/store/walletStore";

describe("Donation Flow Integration", () => {
  it("shows connect wallet button when user is disconnected", () => {
    useWalletStore.setState({
      address: null,
      isConnected: false,
    });

    render(<DonationForm campaignId="1" campaignTitle="Flood Relief 2026" />);

    expect(screen.getByRole("button", { name: /connect wallet to donate/i })).toBeInTheDocument();
  });

  it("updates input field when preset donation amount buttons are clicked", () => {
    useWalletStore.setState({
      address: "GABC1234567890XYZ",
      isConnected: true,
    });

    render(<DonationForm campaignId="1" campaignTitle="Flood Relief 2026" />);

    const preset50 = screen.getByRole("button", { name: "50 XLM" });
    fireEvent.click(preset50);

    const input = screen.getByPlaceholderText(/enter custom amount in xlm/i) as HTMLInputElement;
    expect(input.value).toBe("50");
  });
});
