import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AnalyticsPage from "@/app/analytics/page";

// Mock useAnalytics hook
vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    data: {
      totalFundsRaised: "10500",
      totalFundsDistributed: "4200",
      totalCampaigns: 5,
      activeCampaigns: 3,
      completedCampaigns: 2,
      totalDonationsCount: 24,
      averageDonationAmount: "437.5",
      totalBeneficiariesCount: 15,
      campaignPerformance: [
        {
          id: "1",
          title: "Flood Relief 2026",
          targetAmount: 5000,
          raisedAmount: 2150,
          distributedAmount: 1200,
          progressPercentage: 43,
        },
      ],
      donationTrends: [{ period: "Aug 18", amount: 1200, count: 5 }],
      distributionBreakdown: [{ category: "Emergency Aid", amount: 1200 }],
    },
    isLoading: false,
  }),
}));

describe("AnalyticsPage Component", () => {
  it("renders metric cards and visual breakdown charts", () => {
    render(<AnalyticsPage />);

    expect(screen.getByText("Platform Analytics")).toBeInTheDocument();
    expect(screen.getByText("Total Funds Raised")).toBeInTheDocument();
    expect(screen.getByText("10,500 XLM")).toBeInTheDocument();
    expect(screen.getByText("Total Funds Distributed")).toBeInTheDocument();
    expect(screen.getByText("4,200 XLM")).toBeInTheDocument();
    expect(screen.getByText("Donation Trend & Volume")).toBeInTheDocument();
    expect(screen.getByText("Campaign Goal vs Raised Performance")).toBeInTheDocument();
  });
});
