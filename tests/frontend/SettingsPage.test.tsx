import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SettingsPage from "@/app/settings/page";

describe("SettingsPage Component", () => {
  it("renders settings sections including Wallet Session, Display Preferences, and Network Config", () => {
    render(<SettingsPage />);

    expect(screen.getByText("Application Settings")).toBeInTheDocument();
    expect(screen.getByText("Wallet Session")).toBeInTheDocument();
    expect(screen.getByText("Display Preferences")).toBeInTheDocument();
    expect(screen.getByText("Network & Soroban Configuration")).toBeInTheDocument();
    expect(screen.getByText("Stellar Network")).toBeInTheDocument();
  });
});
