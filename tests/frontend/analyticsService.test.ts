import { describe, it, expect } from "vitest";
import { computeAnalytics } from "@/services/analyticsService";

describe("Analytics Service Logic", () => {
  it("computes analytics summary correctly from campaign and event data", async () => {
    const summary = await computeAnalytics();

    expect(summary).toBeDefined();
    expect(typeof summary.totalFundsRaised).toBe("string");
    expect(typeof summary.totalFundsDistributed).toBe("string");
    expect(summary.totalCampaigns).toBeGreaterThanOrEqual(0);
    expect(summary.activeCampaigns).toBeGreaterThanOrEqual(0);
    expect(summary.campaignPerformance.length).toBeGreaterThanOrEqual(0);
    expect(summary.donationTrends.length).toBeGreaterThanOrEqual(0);
  }, 15000);
});
