import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { WalletButton } from "@/components/wallet/WalletButton";
import { useWalletStore } from "@/store/walletStore";

describe("WalletButton Component", () => {
  it("renders Connect Wallet button when disconnected", () => {
    useWalletStore.setState({
      address: null,
      isConnected: false,
      isConnecting: false,
    });

    render(<WalletButton />);
    expect(screen.getByRole("button", { name: /connect wallet/i })).toBeInTheDocument();
  });

  it("renders truncated address when wallet is connected", () => {
    useWalletStore.setState({
      address: "GABC1234567890XYZ987654321W",
      isConnected: true,
      isConnecting: false,
      walletName: "Freighter",
    });

    render(<WalletButton />);
    expect(screen.getByText("GABC...321W")).toBeInTheDocument();
  });
});
