import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import DashboardPage from "@/app/dashboard/page";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { useWalletStore } from "@/store/walletStore";

describe("End-to-End User Journey Scenarios (Mocked)", () => {
  it("renders Donor portal state when wallet is connected", () => {
    useWalletStore.setState({
      address: "GABC1234567890XYZ",
      isConnected: true,
      walletName: "Freighter",
    });

    render(
      <ReactQueryProvider>
        <DashboardPage />
      </ReactQueryProvider>
    );

    expect(screen.getByText("GiveChain Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Connected Address")).toBeInTheDocument();
    expect(screen.getByText("GABC12...890XYZ")).toBeInTheDocument();
    expect(screen.getByText("Your Donation Provenance History")).toBeInTheDocument();
  });
});
