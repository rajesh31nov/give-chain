import { describe, it, expect } from "vitest";
import { deduplicateEvents } from "@/services/eventService";
import { NormalizedEvent } from "@/types";

describe("Event Normalization & Deduplication", () => {
  it("deduplicates event objects with duplicate IDs", () => {
    const events: NormalizedEvent[] = [
      {
        id: "tx-101-0",
        type: "donation_received",
        timestamp: 100000,
        ledger: 100,
        transactionHash: "hash1",
        contractId: "C1",
        campaignId: "1",
        actor: "GABC",
        amount: "100",
      },
      {
        id: "tx-101-0", // Duplicate ID
        type: "donation_received",
        timestamp: 100000,
        ledger: 100,
        transactionHash: "hash1",
        contractId: "C1",
        campaignId: "1",
        actor: "GABC",
        amount: "100",
      },
      {
        id: "tx-102-0",
        type: "batch_distributed",
        timestamp: 100050,
        ledger: 101,
        transactionHash: "hash2",
        contractId: "C2",
        campaignId: "1",
        actor: "GCHARITY",
        amount: "50",
      },
    ];

    const result = deduplicateEvents(events);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("tx-101-0");
    expect(result[1].id).toBe("tx-102-0");
  });
});
