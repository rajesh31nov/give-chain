import { describe, it, expect } from "vitest";

describe("Role-Based Access Control (RBAC) Matrix", () => {
  type Role = "donor" | "charity" | "beneficiary" | "admin";

  interface PermissionCheck {
    role: Role;
    action: "donate" | "create_campaign" | "approve_beneficiary" | "execute_payout" | "view_analytics";
  }

  const checkPermission = ({ role, action }: PermissionCheck): boolean => {
    switch (role) {
      case "donor":
        return action === "donate" || action === "view_analytics";
      case "charity":
        return (
          action === "donate" ||
          action === "create_campaign" ||
          action === "execute_payout" ||
          action === "view_analytics"
        );
      case "beneficiary":
        return action === "view_analytics";
      case "admin":
        return (
          action === "donate" ||
          action === "create_campaign" ||
          action === "approve_beneficiary" ||
          action === "execute_payout" ||
          action === "view_analytics"
        );
      default:
        return false;
    }
  };

  it("permits donors to donate and view analytics, but restricts administrative actions", () => {
    expect(checkPermission({ role: "donor", action: "donate" })).toBe(true);
    expect(checkPermission({ role: "donor", action: "view_analytics" })).toBe(true);
    expect(checkPermission({ role: "donor", action: "create_campaign" })).toBe(false);
    expect(checkPermission({ role: "donor", action: "approve_beneficiary" })).toBe(false);
    expect(checkPermission({ role: "donor", action: "execute_payout" })).toBe(false);
  });

  it("permits charities to manage campaigns and payouts, but restricts platform beneficiary approval", () => {
    expect(checkPermission({ role: "charity", action: "create_campaign" })).toBe(true);
    expect(checkPermission({ role: "charity", action: "execute_payout" })).toBe(true);
    expect(checkPermission({ role: "charity", action: "approve_beneficiary" })).toBe(false);
  });

  it("permits platform administrators full governance permissions", () => {
    expect(checkPermission({ role: "admin", action: "approve_beneficiary" })).toBe(true);
    expect(checkPermission({ role: "admin", action: "execute_payout" })).toBe(true);
    expect(checkPermission({ role: "admin", action: "create_campaign" })).toBe(true);
  });
});
