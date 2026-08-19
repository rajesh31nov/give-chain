import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { CampaignStatus } from "@/types";

describe("CampaignCard Component", () => {
  const mockCampaign = {
    id: "1",
    owner: "GABC1234567890CHARITY",
    title: "Flood Relief Emergency",
    description: "Emergency supplies for flood victims.",
    targetAmount: "5000",
    raisedAmount: "2500",
    distributedAmount: "1000",
    status: CampaignStatus.Active,
    createdAt: Date.now(),
    category: "Emergency",
  };

  it("renders campaign title, goal, raised amount, and 50% progress", () => {
    render(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText("Flood Relief Emergency")).toBeInTheDocument();
    expect(screen.getByText("Emergency supplies for flood victims.")).toBeInTheDocument();
    expect(screen.getByText("2,500 XLM")).toBeInTheDocument();
    expect(screen.getByText("5,000 XLM")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
