import { describe, it, expect } from "vitest";

interface BeneficiaryRecord {
  recipient: string;
  allocatedAmount: number;
  receivedAmount: number;
  isApproved: boolean;
}

const validateDistributionItem = (
  ben: BeneficiaryRecord,
  requestedAmount: number
): { valid: boolean; error?: string } => {
  if (!ben.isApproved) {
    return { valid: false, error: "Beneficiary is not approved for distribution" };
  }
  if (requestedAmount <= 0) {
    return { valid: false, error: "Distribution amount must be greater than zero" };
  }
  if (ben.receivedAmount + requestedAmount > ben.allocatedAmount) {
    return { valid: false, error: "Requested payout exceeds beneficiary allocation limit" };
  }
  return { valid: true };
};

describe("Distribution Flow & Double-Distribution Guard Validation", () => {
  const mockBeneficiary: BeneficiaryRecord = {
    recipient: "GBENEFICIARY123",
    allocatedAmount: 500,
    receivedAmount: 200,
    isApproved: true,
  };

  it("validates legitimate distribution payout within allocation limit", () => {
    const res = validateDistributionItem(mockBeneficiary, 200);
    expect(res.valid).toBe(true);
  });

  it("rejects payout request exceeding remaining allocation limit", () => {
    const res = validateDistributionItem(mockBeneficiary, 400); // 200 + 400 = 600 > 500 limit
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Requested payout exceeds beneficiary allocation limit");
  });

  it("rejects payout request for unapproved beneficiary", () => {
    const unapprovedBen: BeneficiaryRecord = { ...mockBeneficiary, isApproved: false };
    const res = validateDistributionItem(unapprovedBen, 100);
    expect(res.valid).toBe(false);
    expect(res.error).toBe("Beneficiary is not approved for distribution");
  });
});
